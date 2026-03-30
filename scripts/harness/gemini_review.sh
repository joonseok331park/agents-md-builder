#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TASK="${*:-general review}"
OUT_DIR="$ROOT/.harness/reviews"
REVIEW_TIMEOUT="${GEMINI_REVIEW_TIMEOUT:-10m}"
mkdir -p "$OUT_DIR"

log() {
  printf '[review] %s\n' "$*" >&2
}

write_skip_json() {
  local SUMMARY="$1"
  cat > "$OUT_DIR/gemini_review.json" <<JSON
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

log "Preparing sanitized workspace for Gemini review."
WS="$("$ROOT/scripts/harness/prepare_review_workspace.sh" "$TASK")"
STATUS=$?

if [ "$STATUS" -eq 10 ]; then
  log "Gemini review skipped: no current diff."
  write_skip_json "Gemini review skipped because there is no current diff to review."
  cat "$OUT_DIR/gemini_review.json"
  exit 0
fi

if [ "$STATUS" -eq 11 ]; then
  log "Gemini review skipped: only excluded files changed."
  write_skip_json "Gemini review skipped because only excluded files changed."
  cat "$OUT_DIR/gemini_review.json"
  exit 0
fi

if [ "$STATUS" -ne 0 ]; then
  log "Gemini review skipped: sanitized workspace could not be prepared."
  write_skip_json "Gemini review skipped because the sanitized review workspace could not be prepared."
  cat "$OUT_DIR/gemini_review.json"
  exit 0
fi

RAW_JSON="$OUT_DIR/gemini_outer.json"
FINAL_JSON="$OUT_DIR/gemini_review.json"

pushd "$WS" >/dev/null
log "Running Gemini review with timeout $REVIEW_TIMEOUT."
if run_with_heartbeat "Gemini review" timeout "$REVIEW_TIMEOUT" gemini -p \
  "Read GEMINI.md and .review_payload.md. You are a strict read-only reviewer for AGENTS.md Builder. Review only the sanitized workspace and return raw JSON only with keys summary and findings." \
  --output-format json > "$RAW_JSON" 2>"$OUT_DIR/gemini_review.stderr.log"; then
  STATUS=0
else
  STATUS=$?
fi
popd >/dev/null

if [ "$STATUS" -eq 124 ]; then
  log "Gemini review timed out after $REVIEW_TIMEOUT."
  write_skip_json "Gemini review timed out after $REVIEW_TIMEOUT."
  cat "$OUT_DIR/gemini_review.json"
  exit 0
fi

if [ "$STATUS" -ne 0 ]; then
  log "Gemini review failed or Gemini CLI is not authenticated."
  write_skip_json "Gemini review failed or Gemini CLI is not authenticated. Run 'gemini' once to log in, then try again."
  cat "$OUT_DIR/gemini_review.json"
  exit 0
fi

python3 - "$RAW_JSON" "$FINAL_JSON" <<'PY'
import json
import sys
from pathlib import Path

raw_path = Path(sys.argv[1])
out_path = Path(sys.argv[2])

try:
    outer = json.loads(raw_path.read_text(encoding="utf-8"))
    response = outer.get("response", "")
    parsed = json.loads(response)
    if not isinstance(parsed, dict):
        raise ValueError("Response was not a JSON object")
    parsed.setdefault("summary", "Gemini review completed.")
    parsed.setdefault("findings", [])
except Exception:
    parsed = {
        "summary": "Gemini did not return valid JSON. Treat this review as skipped.",
        "findings": []
    }

out_path.write_text(json.dumps(parsed, ensure_ascii=False, indent=2), encoding="utf-8")
PY

log "Gemini review completed."
cat "$FINAL_JSON"
