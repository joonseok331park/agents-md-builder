#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TASK="${1:-general review}"
OUT_DIR="$ROOT/.harness"

mkdir -p "$OUT_DIR"
WS="$(mktemp -d "$OUT_DIR/review-workspace.XXXXXX")"
cd "$ROOT"

mapfile -t CHANGED < <(
  {
    git diff --name-only --relative -- . 2>/dev/null || true
    git diff --cached --name-only --relative -- . 2>/dev/null || true
    git ls-files --others --exclude-standard 2>/dev/null || true
  } | awk 'NF' | sort -u
)

if [ ${#CHANGED[@]} -eq 0 ]; then
  exit 10
fi

SAFE=()
EXCLUDED=()

for FILE in "${CHANGED[@]}"; do
  [ -z "$FILE" ] && continue
  case "$FILE" in
    *.zip|tsconfig.tsbuildinfo|.claude/settings.local.json)
      EXCLUDED+=("$FILE")
      ;;
    *)
      SAFE+=("$FILE")
      ;;
  esac
done

if [ ${#SAFE[@]} -eq 0 ]; then
  exit 11
fi

export ROOT WS
python3 <<'PY'
import os
import pathlib
import shutil

root = pathlib.Path(os.environ["ROOT"]).resolve()
ws = pathlib.Path(os.environ["WS"]).resolve()
ws.mkdir(parents=True, exist_ok=True)

exclude_top_dirs = {".git", "node_modules", ".next", "out", "dist", "coverage", ".harness"}

def should_exclude(rel_posix: str) -> bool:
    parts = rel_posix.split("/")
    if parts[0] in exclude_top_dirs:
        return True
    if rel_posix.endswith(".zip"):
        return True
    if rel_posix == "tsconfig.tsbuildinfo":
        return True
    if rel_posix == ".claude/settings.local.json":
        return True
    if rel_posix == ".env" or rel_posix.startswith(".env."):
        return True
    if rel_posix.startswith("secrets/"):
        return True
    return False

for src in root.rglob("*"):
    rel = src.relative_to(root).as_posix()
    if should_exclude(rel):
        continue
    dest = ws / rel
    if src.is_dir():
        dest.mkdir(parents=True, exist_ok=True)
    elif src.is_file():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
PY

PAYLOAD="$WS/.review_payload.md"
{
  echo "# Review payload"
  echo
  echo "Task: $TASK"
  echo
  echo "Rules for reviewer:"
  echo "- Review only this sanitized workspace."
  echo "- Never suggest backend, DB, auth, API route, server action, middleware, analytics SDK, or paid API."
  echo "- Never suggest external AI APIs or runtime remote fetches."
  echo "- Excluded local-only files were removed from the workspace."
  echo
  echo "Safe changed files:"
  printf -- "- %s\n" "${SAFE[@]}"
  if [ ${#EXCLUDED[@]} -gt 0 ]; then
    echo
    echo "Excluded changed files:"
    printf -- "- %s\n" "${EXCLUDED[@]}"
  fi
  echo
  echo "Filtered diff stat:"
  git diff --stat -- "${SAFE[@]}" || true
  echo
  echo "Filtered diff:"
  git diff -- "${SAFE[@]}" || true
} > "$PAYLOAD"

echo "$WS"
