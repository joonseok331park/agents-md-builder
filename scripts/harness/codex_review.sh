#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TASK="${*:-general review}"
OUT_DIR="$ROOT/.harness/reviews"
REVIEW_TIMEOUT="${CODEX_REVIEW_TIMEOUT:-10m}"
mkdir -p "$OUT_DIR"

log() {
  printf '[review] %s\n' "$*" >&2
}

write_skip_json() {
  local SUMMARY="$1"
  cat > "$OUT_DIR/codex_review.json" <<JSON
{
  "summary": "$SUMMARY",
  "findings": []
}
JSON
}

run_with_heartbeat() {
  local LABEL="$1"
  shift
  local PID=""
  local HEARTBEAT_PID=""
  local STATUS=0

  "$@" &
  PID="$!"
  (
    while kill -0 "$PID" 2>/dev/null; do
      sleep 15
      if kill -0 "$PID" 2>/dev/null; then
        printf '[review] %s still running...\n' "$LABEL" >&2
      fi
    done
  ) &
  HEARTBEAT_PID="$!"

  if wait "$PID"; then
    STATUS=0
  else
    STATUS="$?"
  fi

  kill "$HEARTBEAT_PID" 2>/dev/null || true
  wait "$HEARTBEAT_PID" 2>/dev/null || true
  return "$STATUS"
}

log "Preparing sanitized workspace for Codex review."
WS="$("$ROOT/scripts/harness/prepare_review_workspace.sh" "$TASK")"
STATUS=$?

if [ "$STATUS" -eq 10 ]; then
  log "Codex review skipped: no current diff."
  write_skip_json "Codex review skipped because there is no current diff to review."
  cat "$OUT_DIR/codex_review.json"
  exit 0
fi

if [ "$STATUS" -eq 11 ]; then
  log "Codex review skipped: only excluded files changed."
  write_skip_json "Codex review skipped because only excluded files changed."
  cat "$OUT_DIR/codex_review.json"
  exit 0
fi

if [ "$STATUS" -ne 0 ]; then
  log "Codex review skipped: sanitized workspace could not be prepared."
  write_skip_json "Codex review skipped because the sanitized review workspace could not be prepared."
  cat "$OUT_DIR/codex_review.json"
  exit 0
fi

cat > "$OUT_DIR/codex_review_schema.json" <<'JSON'
{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "severity": { "type": "string" },
          "file": { "type": ["string", "null"] },
          "issue": { "type": "string" },
          "recommendation": { "type": "string" }
        },
        "required": ["severity", "file", "issue", "recommendation"],
        "additionalProperties": false
      }
    }
  },
  "required": ["summary", "findings"],
  "additionalProperties": false
}
JSON

log "Running Codex review with timeout $REVIEW_TIMEOUT."
if run_with_heartbeat "Codex review" timeout "$REVIEW_TIMEOUT" codex exec \
  --cd "$WS" \
  --sandbox read-only \
  --output-schema "$OUT_DIR/codex_review_schema.json" \
  -o "$OUT_DIR/codex_review.json" \
  "Read AGENTS.md and .review_payload.md. You are a strict read-only code reviewer for AGENTS.md Builder. Review the current safe diff only. Prioritize correctness bugs, static export violations, localStorage safety issues, deterministic generation or linting problems, missing tests, SEO regressions, and unnecessary complexity. Every finding must include severity, file (use null when not file-specific), issue, and recommendation." >/dev/null 2>"$OUT_DIR/codex_review.stderr.log"; then
  STATUS=0
else
  STATUS=$?
fi

if [ "$STATUS" -eq 124 ]; then
  log "Codex review timed out after $REVIEW_TIMEOUT."
  write_skip_json "Codex review timed out after $REVIEW_TIMEOUT."
elif [ "$STATUS" -ne 0 ]; then
  log "Codex review failed or Codex is not logged in."
  write_skip_json "Codex review failed or Codex is not logged in. Run 'codex' once to log in, then try again."
fi

log "Codex review finished."
cat "$OUT_DIR/codex_review.json"
