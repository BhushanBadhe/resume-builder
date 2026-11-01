#!/usr/bin/env bash
# Stop everything started by ./run.sh: dev servers and the Homebrew PostgreSQL service.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PG_SERVICE="postgresql@17"

# Read ports from .env.local, falling back to defaults.
read_env() {
	local value
	value="$(grep -E "^$1=" "$ROOT/.env.local" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"')"
	echo "${value:-$2}"
}
WEB_PORT="$(read_env PORT 3000)"
API_PORT="$(read_env SERVER_PORT 3001)"
EMAIL_PORT=3002

# --- Dev servers ---
echo "Stopping dev servers..."
# Turbo orchestrator for this repo (stops its child tasks).
pkill -TERM -f "$ROOT/node_modules/.*turbo.* run dev" 2>/dev/null || true
sleep 2

# Anything still listening on the dev ports.
for port in "$WEB_PORT" "$API_PORT" "$EMAIL_PORT"; do
	pids="$(lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null || true)"
	if [ -n "$pids" ]; then
		echo "  killing port $port (pid $(echo "$pids" | tr '\n' ' '))"
		kill -TERM $pids 2>/dev/null || true
		sleep 1
		pids="$(lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null || true)"
		[ -n "$pids" ] && kill -KILL $pids 2>/dev/null || true
	fi
done

# --- PostgreSQL ---
echo "Stopping $PG_SERVICE..."
brew services stop "$PG_SERVICE" >/dev/null 2>&1 || true

echo "All services stopped."
