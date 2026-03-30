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

skip_review() {
  local SUMMARY="$1"
  log "$SUMMARY"
  write_skip_json "$SUMMARY"
  cat "$OUT_DIR/gemini_review.json"
  exit 0
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

classify_failure() {
  local LOG_CONTENT=""

  if [ -f "$OUT_DIR/gemini_review.stderr.log" ]; then
    LOG_CONTENT="$(cat "$OUT_DIR/gemini_review.stderr.log")"
  fi

  if grep -Eqi 'resource_exhausted|quota|rate limit|too many requests|429|limit exceeded|exceeded .* quota' <<<"$LOG_CONTENT"; then
    printf 'quota'
    return
  fi

  if grep -Eqi 'not authenticated|not logged in|log in|login required|unauthorized|authentication|api key|permission denied' <<<"$LOG_CONTENT"; then
    printf 'auth'
    return
  fi

  if grep -Eqi 'command not found|no such file or directory' <<<"$LOG_CONTENT"; then
    printf 'tool'
    return
  fi

  printf 'other'
}

log "Preparing sanitized workspace for Gemini review."
WS="$("$ROOT/scripts/harness/prepare_review_workspace.sh" "$TASK")"
STATUS=$?

if [ "$STATUS" -eq 10 ]; then
  skip_review "Gemini review skipped because there is no current diff to review."
fi

if [ "$STATUS" -eq 11 ]; then
  skip_review "Gemini review skipped because only excluded files changed."
fi

if [ "$STATUS" -ne 0 ]; then
  skip_review "Gemini review skipped because the sanitized review workspace could not be prepared."
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
  skip_review "Gemini review skipped because it timed out after $REVIEW_TIMEOUT."
fi

if [ "$STATUS" -ne 0 ]; then
  case "$(classify_failure)" in
    quota)
      skip_review "Gemini review skipped because Gemini quota or rate limits were reached."
      ;;
    auth)
      skip_review "Gemini review skipped because Gemini CLI is not authenticated."
      ;;
    tool)
      skip_review "Gemini review skipped because Gemini CLI is unavailable in this environment."
      ;;
    *)
      skip_review "Gemini review skipped because Gemini review failed unexpectedly."
      ;;
  esac
fi

python3 - "$RAW_JSON" "$FINAL_JSON" <<'PY'
import json
import sys
from pathlib import Path

raw_path = Path(sys.argv[1])
out_path = Path(sys.argv[2])
raw_text = raw_path.read_text(encoding="utf-8")

def classify_skip(message: str) -> str:
    lower = message.lower()
    if any(token in lower for token in ["resource_exhausted", "quota", "rate limit", "too many requests", "429"]):
        return "Gemini review skipped because Gemini quota or rate limits were reached."
    if any(token in lower for token in ["not authenticated", "not logged in", "login", "unauthorized", "authentication"]):
        return "Gemini review skipped because Gemini CLI is not authenticated."
    return "Gemini did not return valid JSON. Treat this review as skipped."

try:
    outer = json.loads(raw_text)
    response = outer.get("response", "")
    parsed = json.loads(response)
    if not isinstance(parsed, dict):
        raise ValueError("Response was not a JSON object")
    parsed.setdefault("summary", "Gemini review completed.")
    parsed.setdefault("findings", [])
except Exception:
    parsed = {
        "summary": classify_skip(raw_text),
        "findings": []
    }

out_path.write_text(json.dumps(parsed, ensure_ascii=False, indent=2), encoding="utf-8")
PY

log "Gemini review completed."
cat "$FINAL_JSON"
