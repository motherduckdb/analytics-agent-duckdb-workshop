#!/usr/bin/env bash
# post-create.sh — runs once after the container is created
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_DIR="$(dirname "$SCRIPT_DIR")/workshop"

echo "==> Setting up workshop environment..."

# Ensure PATH includes uv tools
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Install DuckDB CLI
uv tool install duckdb-cli 2>/dev/null || true

# Install Python dependencies
if [ -f "$WORKSHOP_DIR/pyproject.toml" ]; then
    echo "==> Installing workshop Python deps..."
    cd "$WORKSHOP_DIR" && uv sync
fi

# Configure opencode to use local Ollama
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "provider": {
    "ollama": {
      "name": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "gemma4:latest": {
          "name": "gemma4:latest",
          "contextWindow": 131072,
          "defaultTemperature": 0.7
        }
      }
    }
  },
  "model": "ollama/gemma4:latest"
}
EOF

# Install Claude Code if Node is available (Path B — optional)
if command -v npm &> /dev/null; then
    echo "==> Installing Claude Code (optional, for Path B)..."
    npm install -g @anthropic-ai/claude-code 2>/dev/null || echo "    Claude Code install skipped."
fi

# ---- Pull Gemma 4 model ----
# Auto-pull in Codespaces (prebuild caches it). Skip locally (conference wifi).
if [ -n "${CODESPACES:-}" ]; then
    echo "==> Codespace detected — pulling Gemma 4 26B (cached by prebuild)..."
    ollama serve &
    OLLAMA_PID=$!
    for i in $(seq 1 30); do
        curl -sf http://localhost:11434/api/tags > /dev/null 2>&1 && break
        sleep 2
    done
    ollama pull gemma4:latest
    kill $OLLAMA_PID 2>/dev/null || true
else
    echo "==> Local environment detected — skipping model pull (9.6GB)."
    echo "    Run 'make pull' when you have good bandwidth."
fi

echo "==> Workshop environment ready!"
