#!/usr/bin/env bash
# post-start.sh — runs every time the container starts
set -euo pipefail

KEY_STATUS="missing"
if [ -n "${OPENROUTER_API_KEY:-}" ]; then
    KEY_STATUS="set"
elif [ -n "${ANTHROPIC_API_KEY:-}" ]; then
    KEY_STATUS="anthropic key set"
fi

echo ""
echo "============================================"
echo "  SQL is Dead, Long Live SQL — ready"
echo ""
echo "  OPENROUTER_API_KEY: ${KEY_STATUS}"
echo ""
echo "  If not set, grab one at:"
echo "    https://motherduck.com/minter   (pre-funded)"
echo "    https://openrouter.ai           (BYOK)"
echo ""
echo "    export OPENROUTER_API_KEY=sk-or-v1-..."
echo ""
echo "  Then:"
echo "    opencode         # agentic CLI (Sonnet via OpenRouter)"
echo "    claude           # Claude Code (needs ANTHROPIC_API_KEY)"
echo "    duckdb           # DuckDB CLI"
echo "============================================"
