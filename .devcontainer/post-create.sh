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

# Install modern opencode (sst/opencode) + Claude Code via npm
# (Node is provided by the devcontainer `node` feature, not the Dockerfile.)
if command -v npm &> /dev/null; then
    echo "==> Installing opencode (agentic CLI, Path A)..."
    npm install -g opencode-ai 2>/dev/null || echo "    opencode install skipped."

    echo "==> Installing Claude Code (optional, Path B)..."
    npm install -g @anthropic-ai/claude-code 2>/dev/null || echo "    Claude Code install skipped."
fi

# Configure opencode to use local Ollama. Matches the modern opencode
# schema (opencode.ai) so `opencode` and `ollama launch opencode --model gemma4`
# both pick up the same config. Both model tags are listed so the "gemma4"
# alias created after the pull resolves cleanly.
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/gemma4:latest",
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
        },
        "gemma4": {
          "name": "gemma4",
          "contextWindow": 131072,
          "defaultTemperature": 0.7
        }
      }
    }
  }
}
EOF

# ---- Pull Gemma 4 model ----
# Auto-pull in Codespaces (prebuild caches it). Skip locally (conference wifi).
if [ -n "${CODESPACES:-}" ]; then
    echo "==> Codespace detected — pulling gemma4:latest (cached by prebuild)..."
    ollama serve &
    OLLAMA_PID=$!
    for i in $(seq 1 30); do
        curl -sf http://localhost:11434/api/tags > /dev/null 2>&1 && break
        sleep 2
    done
    ollama pull gemma4:latest
    # Alias so `ollama launch opencode --model gemma4` (bare tag) resolves.
    ollama cp gemma4:latest gemma4 2>/dev/null || true
    kill $OLLAMA_PID 2>/dev/null || true
else
    echo "==> Local environment detected — skipping model pull (9.6GB)."
    echo "    Run 'make pull' when you have good bandwidth."
fi

echo "==> Workshop environment ready!"
