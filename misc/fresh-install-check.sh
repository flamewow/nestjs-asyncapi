#!/usr/bin/env bash
# Simulate a new contributor's first clone: wipe installed artifacts, reinstall
# from package-lock.json, and run the e2e suite (which hits /async-api and will
# fail if the AsyncAPI html-template bundle can't be loaded).
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use
fi

node --version
npm --version

rm -rf node_modules dist
npm ci
npm run test:e2e

echo "fresh-install check: OK"
