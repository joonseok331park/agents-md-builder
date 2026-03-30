#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

BASE_BRANCH="$("$ROOT/scripts/harness/base_branch.sh")"
CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
HAS_COMMITS=0

if git rev-parse --verify HEAD >/dev/null 2>&1; then
  HAS_COMMITS=1
fi

echo "Base branch: $BASE_BRANCH"
echo "Current branch: ${CURRENT_BRANCH:-detached}"
echo
echo "Recent commits:"
if [ "$HAS_COMMITS" -eq 1 ]; then
  git log --oneline -n 5
else
  echo "(no commits yet)"
fi

if [ "$HAS_COMMITS" -eq 1 ] && [ -n "$CURRENT_BRANCH" ] && [ "$CURRENT_BRANCH" != "$BASE_BRANCH" ]; then
  echo
  echo "Commits on this branch not on $BASE_BRANCH:"
  git log --oneline "$BASE_BRANCH"..HEAD || true
  echo
  echo "Changed files vs $BASE_BRANCH:"
  git diff --name-only "$BASE_BRANCH"..HEAD -- || true
  echo
  echo "Diff stat vs $BASE_BRANCH:"
  git diff --stat "$BASE_BRANCH"..HEAD -- || true
fi
