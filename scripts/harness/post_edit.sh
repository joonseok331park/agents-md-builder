#!/usr/bin/env bash
set -euo pipefail

if [ -f package.json ]; then
  npm run format --if-present >/dev/null 2>&1 || true
fi
