#!/usr/bin/env bash
# post-create.sh — runs once after the container is created
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_DIR="$(dirname "$SCRIPT_DIR")/workshop"

echo "==> Setting up workshop environment..."

# Ensure PATH includes uv tools
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Install DuckDB CLI (idempotent)
uv tool install duckdb-cli 2>/dev/null || true

# Install Python dependencies
if [ -f "$WORKSHOP_DIR/pyproject.toml" ]; then
    echo "==> Installing workshop Python deps..."
    cd "$WORKSHOP_DIR" && uv sync
fi

# Install agentic CLIs — opencode (primary) + Claude Code (optional)
if command -v npm &> /dev/null; then
    echo "==> Installing opencode..."
    npm install -g opencode-ai 2>/dev/null || echo "    opencode install skipped."

    echo "==> Installing Claude Code (optional)..."
    npm install -g @anthropic-ai/claude-code 2>/dev/null || echo "    Claude Code install skipped."
fi

# Default opencode config: OpenRouter + GPT-5.4-nano. opencode picks up
# OPENROUTER_API_KEY from the environment at runtime — no key baked in here.
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/openai/gpt-5.4-nano"
}
EOF

# Reclaim install-time caches (1-2 GiB wedged in tmpfs otherwise)
echo "==> Cleaning caches..."
npm cache clean --force 2>/dev/null || true
rm -rf /tmp/v8-compile-cache-* /tmp/npm-* 2>/dev/null || true
sync

echo "==> Workshop environment ready!"
