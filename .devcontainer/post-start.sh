#!/usr/bin/env bash
# post-start.sh — runs every time the container starts
set -euo pipefail

echo "==> Starting Ollama server..."
ollama serve &

for i in $(seq 1 30); do
    curl -sf http://localhost:11434/api/tags > /dev/null 2>&1 && break
    sleep 2
done

echo ""
echo "============================================"
echo "  Workshop environment ready!"
echo ""
echo "  Ollama API:  http://localhost:11434"
echo "  Model:       gemma4:latest (9.6GB)"
echo ""
echo "  Quick start:"
echo "    opencode              # agentic CLI (Path A)"
echo "    claude                # Claude Code  (Path B)"
echo "    duckdb                # DuckDB CLI"
echo "============================================"
