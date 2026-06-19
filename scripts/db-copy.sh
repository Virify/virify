#!/usr/bin/env bash
#
# db-copy.sh — Copy a PostgreSQL database from one env var to another.
#
# Usage:
#   pnpm db:copy SOURCE_ENV_VAR TARGET_ENV_VAR
#   ./scripts/db-copy.sh SOURCE_ENV_VAR TARGET_ENV_VAR
#
# Example (prod -> local):
#   pnpm db:copy PROD_DATABASE_URL DATABASE_URL
#
# The two arguments are the NAMES of env vars (not the URLs themselves),
# so no connection strings are ever hard-coded here. They are read from your
# shell environment or, if present, from a local .env file.
#
# ⚠️  The TARGET database is DROPPED and recreated. Make sure the target is
#     the one you intend to overwrite (typically a local/dev database).
#
set -euo pipefail

SOURCE_VAR="${1:-}"
TARGET_VAR="${2:-}"

if [[ -z "$SOURCE_VAR" || -z "$TARGET_VAR" ]]; then
  echo "Usage: pnpm db:copy SOURCE_ENV_VAR TARGET_ENV_VAR" >&2
  echo "Example: pnpm db:copy PROD_DATABASE_URL DATABASE_URL" >&2
  exit 1
fi

# Load .env if the vars aren't already exported.
if [[ -f .env ]]; then
  # Parse .env defensively: strip carriage returns (Windows/WSL CRLF) and
  # skip comments/blank lines so a stray \r can't break sourcing.
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -z "$line" || "$line" == \#* ]] && continue
    [[ "$line" != *=* ]] && continue
    export "${line?}"
  done < .env
fi

SOURCE_URL="${!SOURCE_VAR:-}"
TARGET_URL="${!TARGET_VAR:-}"

if [[ -z "$SOURCE_URL" ]]; then
  echo "Error: env var '$SOURCE_VAR' is empty or unset." >&2
  exit 1
fi
if [[ -z "$TARGET_URL" ]]; then
  echo "Error: env var '$TARGET_VAR' is empty or unset." >&2
  exit 1
fi

# Require the tools.
for tool in pg_dump pg_restore psql; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Error: '$tool' not found. Install the PostgreSQL client tools." >&2
    exit 1
  fi
done

# Strip query params (e.g. ?connection_limit=60) for tools that dislike them.
strip_params() { echo "${1%%\?*}"; }
SOURCE_CLEAN="$(strip_params "$SOURCE_URL")"
TARGET_CLEAN="$(strip_params "$TARGET_URL")"

# Redact credentials when echoing the target host for the confirmation prompt.
redact() { echo "$1" | sed -E 's#://[^@]+@#://***:***@#'; }

echo "About to copy:"
echo "  FROM ($SOURCE_VAR): $(redact "$SOURCE_CLEAN")"
echo "  INTO ($TARGET_VAR): $(redact "$TARGET_CLEAN")"
echo
echo "⚠️  This will DROP and recreate the target schema. Existing target data will be lost."
read -r -p "Type 'yes' to continue: " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Aborted."
  exit 1
fi

DUMP_FILE="$(mktemp -t db-copy-XXXXXX.dump)"
cleanup() { rm -f "$DUMP_FILE"; }
trap cleanup EXIT

echo "→ Dumping source..."
pg_dump --format=custom --no-owner --no-privileges --file="$DUMP_FILE" "$SOURCE_CLEAN"

echo "→ Resetting target schema..."
# A full schema reset is far more reliable than pg_restore --clean, which can't
# drop objects that have cross-table dependencies (e.g. FK constraints) and
# chokes on leftovers from a previously failed restore. Dropping and recreating
# the schemas gives pg_restore a clean slate, so objects load in the correct
# dependency order with no "already exists"/duplicate-key errors.
#
# We also drop the auxiliary PostGIS schemas (tiger, tiger_data, topology) which
# live outside "public"; otherwise the dump's CREATE SCHEMA for them collides.
psql "$TARGET_CLEAN" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS tiger CASCADE;
DROP SCHEMA IF EXISTS tiger_data CASCADE;
DROP SCHEMA IF EXISTS topology CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
SQL

echo "→ Restoring into target..."
# --no-owner/--no-privileges avoid role mismatches between environments.
# --exit-on-error surfaces real problems instead of silently ignoring them.
pg_restore \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  --dbname="$TARGET_CLEAN" \
  "$DUMP_FILE"

echo "✓ Done. '$SOURCE_VAR' copied into '$TARGET_VAR'."
