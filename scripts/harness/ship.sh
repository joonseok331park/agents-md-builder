#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TASK="${*:-__AUTO_NEXT__}"
HEARTBEAT_INTERVAL="${SHIP_HEARTBEAT_INTERVAL:-15}"
RENDERER="$ROOT/scripts/harness/render_claude_stream.py"
MCP_CONFIG="$ROOT/scripts/harness/claude-no-mcp.json"
COMPLETION_SCRIPT="$ROOT/scripts/harness/project_completion.py"

log() {
  printf '[ship] %s\n' "$*" >&2
}

print_completion_report() {
  local SUMMARY="$1"
  local EXTRA="${2:-}"

  printf '[assistant] Project already complete.\n' >&2
  printf '[assistant] %s\n' "$SUMMARY" >&2
  if [ -n "$EXTRA" ]; then
    printf '[assistant] %s\n' "$EXTRA" >&2
  fi
}

is_auto_next_task() {
  local NORMALIZED

  NORMALIZED="$(
    printf '%s' "$TASK" \
      | tr '[:upper:]' '[:lower:]' \
      | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//'
  )"

  case "$NORMALIZED" in
    "__auto_next__"|"continue"|"next"|"next step"|"do the next step")
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

maybe_finalize_completed_branch() {
  local SUMMARY="$1"
  local BASE_BRANCH
  local CURRENT_BRANCH
  local COUNTS
  local BASE_ONLY
  local CURRENT_ONLY

  CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
  BASE_BRANCH="$("$ROOT/scripts/harness/base_branch.sh")"

  if [ -z "$CURRENT_BRANCH" ]; then
    log "Auto-next skipped: project already complete in detached HEAD."
    print_completion_report "$SUMMARY" "Repository is in detached HEAD state, so no base-branch finalization was attempted."
    return 0
  fi

  if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
    log "Auto-next skipped: project already complete on $BASE_BRANCH."
    print_completion_report "$SUMMARY" "Already on the base branch: $BASE_BRANCH."
    return 0
  fi

  COUNTS="$(git rev-list --left-right --count "$BASE_BRANCH"...HEAD)"
  BASE_ONLY="${COUNTS%%$'\t'*}"
  CURRENT_ONLY="${COUNTS##*$'\t'}"

  if [ "$BASE_ONLY" -eq 0 ] && [ "$CURRENT_ONLY" -gt 0 ]; then
    log "Project complete and $CURRENT_BRANCH is ahead of $BASE_BRANCH. Running final verification."
    if ! "$ROOT/scripts/harness/local_checks.sh"; then
      log "Final verification failed. Clearing the completion marker and continuing with a normal ship run."
      "$COMPLETION_SCRIPT" clear >/dev/null 2>&1 || true
      return 1
    fi

    log "Fast-forwarding $BASE_BRANCH to $CURRENT_BRANCH."
    git checkout "$BASE_BRANCH" >/dev/null 2>&1
    if git merge --ff-only "$CURRENT_BRANCH" >/dev/null 2>&1; then
      log "Auto-finalized $CURRENT_BRANCH into $BASE_BRANCH."
      print_completion_report "$SUMMARY" "Fast-forwarded $CURRENT_BRANCH into $BASE_BRANCH automatically."
      return 0
    fi

    git checkout "$CURRENT_BRANCH" >/dev/null 2>&1 || true
    log "Auto-finalization failed. Leaving the completed branch unchanged."
    print_completion_report "$SUMMARY" "Automatic base-branch finalization failed, so the completed branch was left unchanged."
    return 0
  fi

  log "Auto-next skipped: project already complete, but branch is not ahead of $BASE_BRANCH."
  print_completion_report "$SUMMARY" "Automatic base-branch finalization was skipped because $CURRENT_BRANCH is not a fast-forward candidate for $BASE_BRANCH."
  return 0
}

descendant_pids() {
  local PARENT="$1"
  local CHILD

  while read -r CHILD; do
    [ -z "$CHILD" ] && continue
    printf '%s\n' "$CHILD"
    descendant_pids "$CHILD"
  done < <(pgrep -P "$PARENT" 2>/dev/null || true)
}

current_stage() {
  local CLAUDE_PID="$1"
  local CHILDREN
  local COMMANDS

  CHILDREN="$(descendant_pids "$CLAUDE_PID" | tr '\n' ' ')"
  if [ -z "$CHILDREN" ]; then
    printf 'Claude is reasoning'
    return
  fi

  COMMANDS="$(ps -o cmd= -p $CHILDREN 2>/dev/null || true)"

  if grep -q 'npm install' <<<"$COMMANDS"; then
    printf 'Installing dependencies'
  elif grep -q 'scripts/harness/local_checks\.sh' <<<"$COMMANDS"; then
    printf 'Running local checks'
  elif grep -q 'scripts/harness/verify_review_resolution\.py' <<<"$COMMANDS"; then
    printf 'Verifying review resolutions'
  elif grep -q 'scripts/harness/record_review_resolution\.py' <<<"$COMMANDS"; then
    printf 'Recording review resolutions'
  elif grep -q 'scripts/harness/branch_context\.sh\|scripts/harness/base_branch\.sh' <<<"$COMMANDS"; then
    printf 'Inspecting branch context'
  elif grep -q 'npm run lint' <<<"$COMMANDS"; then
    printf 'Running lint'
  elif grep -q 'npm run typecheck' <<<"$COMMANDS"; then
    printf 'Running typecheck'
  elif grep -q 'npm run test' <<<"$COMMANDS"; then
    printf 'Running tests'
  elif grep -q 'npm run build' <<<"$COMMANDS"; then
    printf 'Running build'
  elif grep -q 'scripts/harness/codex_review\.sh\|codex exec' <<<"$COMMANDS"; then
    printf 'Running Codex review'
  elif grep -q 'scripts/harness/gemini_review\.sh\|gemini -p' <<<"$COMMANDS"; then
    printf 'Running Gemini review'
  elif grep -q 'git commit' <<<"$COMMANDS"; then
    printf 'Creating commit'
  else
    printf 'Claude is reasoning'
  fi
}

monitor_claude() {
  local CLAUDE_PID="$1"
  local LAST_STAGE=""
  local STAGE

  while kill -0 "$CLAUDE_PID" 2>/dev/null; do
    STAGE="$(current_stage "$CLAUDE_PID")"
    if [ "$STAGE" != "$LAST_STAGE" ]; then
      log "$STAGE."
      LAST_STAGE="$STAGE"
    else
      log "$STAGE..."
    fi
    sleep "$HEARTBEAT_INTERVAL"
  done
}

CLAUDE_PID=""
MONITOR_PID=""
STREAM_DIR="$(mktemp -d "${TMPDIR:-/tmp}/agents-md-builder-ship.XXXXXX")"
STREAM_PIPE="$STREAM_DIR/claude-stream.jsonl"
mkfifo "$STREAM_PIPE"

cleanup() {
  if [ -n "${MONITOR_PID:-}" ] && kill -0 "$MONITOR_PID" 2>/dev/null; then
    kill "$MONITOR_PID" 2>/dev/null || true
  fi
  if [ -n "${CLAUDE_PID:-}" ] && kill -0 "$CLAUDE_PID" 2>/dev/null; then
    kill "$CLAUDE_PID" 2>/dev/null || true
  fi
  rm -rf "$STREAM_DIR"
}

trap cleanup EXIT INT TERM

python3 "$RENDERER" <"$STREAM_PIPE" &
RENDERER_PID="$!"

mkdir -p "$ROOT/.harness/reviews"
rm -f \
  "$ROOT/.harness/reviews/codex_review.json" \
  "$ROOT/.harness/reviews/gemini_review.json" \
  "$ROOT/.harness/reviews/gemini_outer.json" \
  "$ROOT/.harness/reviews/review_resolution.json"

if is_auto_next_task; then
  if COMPLETION_SUMMARY="$("$COMPLETION_SCRIPT" check --clear-stale 2>/dev/null)"; then
    if maybe_finalize_completed_branch "$COMPLETION_SUMMARY"; then
      exit 0
    fi
  fi
fi

log "Starting ship task: $TASK"

claude -p "$TASK" \
  --verbose \
  --output-format stream-json \
  --include-partial-messages \
  --permission-mode acceptEdits \
  --tools "Read,Glob,Grep,Edit,MultiEdit,Write,Bash" \
  --disallowedTools "AskUserQuestion,TaskOutput,Bash(git merge *),Bash(git rebase *),Bash(git pull *),Bash(git push *),Bash(git reset *),Bash(git stash *),Bash(git cherry-pick *)" \
  --strict-mcp-config \
  --mcp-config "$MCP_CONFIG" \
  --append-system-prompt-file "$ROOT/.claude/workflows/ship.md" \
  --allowedTools "Read" "Glob" "Grep" "Edit" "MultiEdit" "Write" \
  "Bash(pwd)" "Bash(ls *)" "Bash(find *)" "Bash(cat *)" "Bash(head *)" "Bash(tail *)" "Bash(sed *)" \
  "Bash(git status *)" "Bash(git diff *)" "Bash(git log *)" "Bash(git show *)" "Bash(git rev-parse *)" "Bash(git branch *)" "Bash(git switch *)" "Bash(git checkout *)" "Bash(git add *)" "Bash(git commit *)" \
  "Bash(npm install)" \
  "Bash(npm run lint)" "Bash(npm run lint *)" \
  "Bash(npm run typecheck)" "Bash(npm run typecheck *)" \
  "Bash(npm run test)" "Bash(npm run test *)" \
  "Bash(npm run build)" "Bash(npm run build *)" \
  "Bash(python3 scripts/harness/project_completion.py *)" \
  "Bash(python3 scripts/harness/record_review_resolution.py *)" \
  "Bash(python3 scripts/harness/verify_review_resolution.py)" \
  "Bash(python3 scripts/harness/verify_review_resolution.py *)" \
  "Bash(./scripts/harness/*)" >"$STREAM_PIPE" &
CLAUDE_PID="$!"

monitor_claude "$CLAUDE_PID" &
MONITOR_PID="$!"

set +e
wait "$CLAUDE_PID"
STATUS="$?"
set -e

wait "$RENDERER_PID" 2>/dev/null || true
if [ -n "${MONITOR_PID:-}" ] && kill -0 "$MONITOR_PID" 2>/dev/null; then
  kill "$MONITOR_PID" 2>/dev/null || true
  wait "$MONITOR_PID" 2>/dev/null || true
fi

if [ "$STATUS" -ne 0 ]; then
  log "Ship task exited with status $STATUS."
fi

exit "$STATUS"
