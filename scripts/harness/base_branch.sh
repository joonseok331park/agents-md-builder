#!/usr/bin/env bash
set -euo pipefail

CURRENT_BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH"
    exit 0
  fi
fi

if git rev-parse --verify main >/dev/null 2>&1; then
  echo "main"
  exit 0
fi

if git rev-parse --verify master >/dev/null 2>&1; then
  echo "master"
  exit 0
fi

REMOTE_HEAD="$(git symbolic-ref --quiet refs/remotes/origin/HEAD 2>/dev/null || true)"
if [ -n "$REMOTE_HEAD" ]; then
  REMOTE_BRANCH="${REMOTE_HEAD#refs/remotes/origin/}"
  if git rev-parse --verify "$REMOTE_BRANCH" >/dev/null 2>&1; then
    echo "$REMOTE_BRANCH"
    exit 0
  fi
fi

echo "Could not determine a base branch. Expected main, master, or origin/HEAD." >&2
exit 1
