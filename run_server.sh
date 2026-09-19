#!/usr/bin/env bash
# Script to run the Fog Prediction website locally on Linux

PORT="${1:-8000}"
export PATH="$HOME/.local/bin:$PATH"

if ! command -v frankenphp &>/dev/null; then
    echo "FrankenPHP binary not found in PATH or ~/.local/bin"
    exit 1
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "==========================================================="
echo " Fog Prediction Web Application is RUNNING"
echo " Open in your browser: http://localhost:${PORT}"
echo " Press Ctrl+C to stop the server"
echo "==========================================================="

exec frankenphp php-server --listen "127.0.0.1:${PORT}"
