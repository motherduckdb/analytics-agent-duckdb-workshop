#!/usr/bin/env bash
# post-start.sh — runs every time the container starts
set -euo pipefail

echo "==> Starting Ollama server..."
ollama serve &

for i in $(seq 1 30); do
    curl -sf http://localhost:11434/api/tags > /dev/null 2>&1 && break
    sleep 2
done

# In Codespaces, make sure gemma4:latest is present (idempotent: no-op if already pulled).
# This handles codespaces that booted before the auto-pull was added, or when no
# prebuild is configured.
if [ -n "${CODESPACES:-}" ]; then
    if ! ollama list 2>/dev/null | grep -q "gemma4:latest"; then
        echo "==> gemma4:latest not found — pulling now (9.6 GB, ~5 min)..."
        ollama pull gemma4:latest
    fi
    # Ensure bare-tag alias for `ollama launch opencode --model gemma4`
    if ! ollama list 2>/dev/null | awk '{print $1}' | grep -qx "gemma4"; then
        ollama cp gemma4:latest gemma4 2>/dev/null || true
    fi
fi

echo ""
echo "============================================"
echo "  Workshop environment ready!"
echo ""
echo "  Ollama API:  http://localhost:11434"
echo "  Model:       gemma4:latest (9.6GB)"
echo ""
echo "  Quick start:"
echo "    ollama launch opencode --model gemma4   # agentic CLI (Path A)"
echo "    claude                                   # Claude Code  (Path B)"
echo "    duckdb                                   # DuckDB CLI"
echo "============================================"
