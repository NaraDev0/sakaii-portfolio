#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_NAME="sakaii-backup-${TIMESTAMP}"

mkdir -p "$BACKUP_DIR"

echo "Backup en cours..."

[ -f directus/database/data.db ] || {
  echo "Base SQLite introuvable : directus/database/data.db" >&2
  exit 1
}
[ -f .env ] || {
  echo ".env introuvable" >&2
  exit 1
}

cp directus/database/data.db "$BACKUP_DIR/${BACKUP_NAME}-database.db"
tar -czf "$BACKUP_DIR/${BACKUP_NAME}-uploads.tar.gz" directus/uploads/
cp .env "$BACKUP_DIR/${BACKUP_NAME}.env"

echo "Backup termine : $BACKUP_DIR/${BACKUP_NAME}-*"
echo "Fichiers :"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}-"*
