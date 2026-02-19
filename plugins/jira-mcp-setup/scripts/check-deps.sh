#!/bin/bash
set -euo pipefail

ERRORS=()

# Check Python 3
if ! command -v python3 &>/dev/null; then
  ERRORS+=("Python 3 is not installed. Install it from https://www.python.org/downloads/ or via: brew install python3")
fi

# Check uv / uvx
if ! command -v uvx &>/dev/null && ! command -v uv &>/dev/null; then
  ERRORS+=("uv is not installed. Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh")
fi

# Check jq (needed for setup-mcp.sh)
if ! command -v jq &>/dev/null; then
  ERRORS+=("jq is not installed. Install it with: brew install jq")
fi

if [[ ${#ERRORS[@]} -gt 0 ]]; then
  echo "❌ Missing dependencies:"
  for err in "${ERRORS[@]}"; do
    echo "  - $err"
  done
  exit 1
fi

echo "✅ All dependencies are installed."
exit 0
