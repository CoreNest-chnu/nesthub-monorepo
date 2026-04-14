#!/usr/bin/env bash
# Піднімає тільки БД (postgres) + pgAdmin у Docker.
# API / Web не чіпає — зручно коли Nest запускаєш локально (bun run start:dev).

set -euo pipefail

# Переходимо в корінь репозиторію (цей скрипт лежить у ./bin)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

if [ ! -f .env ]; then
  echo "⚠️  .env не знайдено у корені. Копіюю з .env.example..."
  cp .env.example .env
fi

echo "🐘 Піднімаю postgres + pgadmin..."
docker compose up -d db pgadmin

echo "⏳ Чекаю готовності БД..."
# DB_USER/DB_NAME підтягнуться з .env через docker compose
until docker compose exec -T db pg_isready -U "${DB_USER:-postgres}" -d "${DB_NAME:-postgres}" >/dev/null 2>&1; do
  sleep 1
done

echo "✅ БД готова."
echo "   Postgres:  localhost:${DB_PORT:-5433}"
echo "   pgAdmin:   http://localhost:${PGADMIN_PORT:-5050}"
