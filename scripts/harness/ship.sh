#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TASK="${*:-__AUTO_NEXT__}"
HEARTBEAT_INTERVAL="${SHIP_HEARTBEAT_INTERVAL:-15}"
RENDERER="$ROOT/scripts/harness/render_claude_stream.py"
MCP_CONFIG="$ROOT/scripts/harness/claude-no-mcp.json"

log() {
  printf '[ship] %s\n' "$*" >&2
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
