#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] npm install"
npm install

echo "[2/5] npm run lint"
npm run lint

echo "[3/5] npm run typecheck"
npm run typecheck

echo "[4/5] npm run test"
npm run test

echo "[5/5] npm run build"
npm run build
