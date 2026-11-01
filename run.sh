#!/usr/bin/env bash
# Start Reactive Resume locally: Node 24 (nvm) + Homebrew PostgreSQL + `pnpm dev`.
# Stop with Ctrl+C, or run ./abort.sh from another terminal.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PG_SERVICE="postgresql@17"
NODE_VERSION="24"

cd "$ROOT"

# --- Node 24 via nvm ---
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
	echo "nvm not found at $NVM_DIR. Install nvm first." >&2
	exit 1
fi
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm use "$NODE_VERSION" >/dev/null 2>&1 || nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION" >/dev/null
echo "Node $(node -v)"

# --- pnpm via corepack ---
if ! command -v pnpm >/dev/null 2>&1; then
	corepack enable
fi
echo "pnpm $(pnpm -v)"

# --- PostgreSQL ---
PG_BIN="$(brew --prefix "$PG_SERVICE")/bin"
if ! "$PG_BIN/pg_isready" -q -h localhost -p 5432; then
	echo "Starting $PG_SERVICE..."
	brew services start "$PG_SERVICE" >/dev/null
	for _ in $(seq 1 30); do
		"$PG_BIN/pg_isready" -q -h localhost -p 5432 && break
		sleep 1
	done
fi
if ! "$PG_BIN/pg_isready" -q -h localhost -p 5432; then
	echo "PostgreSQL did not become ready on localhost:5432." >&2
	exit 1
fi
echo "PostgreSQL ready"

# --- Environment and dependencies ---
if [ ! -f .env.local ]; then
	echo ".env.local missing. Copy .env.example to .env.local and configure it." >&2
	exit 1
fi
if [ ! -d node_modules ]; then
	pnpm install --frozen-lockfile
fi

# --- Start web (3000), API (3001), email preview (3002) ---
echo "Starting dev servers: http://localhost:3000"
exec pnpm dev
