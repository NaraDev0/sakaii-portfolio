#!/usr/bin/env bash
set -euo pipefail

run_as_root() {
  if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    "$@"
  fi
}

echo "Mise a jour Sakaii Portfolio..."

git pull origin main
run_as_root docker compose up -d --build

echo "Mise a jour terminee."
echo "Si le schema Directus a change, relancez : DIRECTUS_URL=http://localhost:8055 node seed.mjs"
