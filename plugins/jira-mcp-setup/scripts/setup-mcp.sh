#!/bin/bash
set -euo pipefail

# --- Add .mcp.json to .gitignore ---
if [[ "${1:-}" == "--add-gitignore" ]]; then
  GITIGNORE=".gitignore"
  ENTRY=".mcp.json"

  if [[ -f "$GITIGNORE" ]] && grep -qxF "$ENTRY" "$GITIGNORE"; then
    echo "ℹ️  $ENTRY is already in $GITIGNORE"
  else
    echo "$ENTRY" >> "$GITIGNORE"
    echo "✅ Added $ENTRY to $GITIGNORE"
  fi
  exit 0
fi

# --- Main setup ---
JIRA_URL="${1:-}"
JIRA_USERNAME="${2:-}"
JIRA_API_TOKEN="${3:-}"

if [[ -z "$JIRA_URL" || -z "$JIRA_USERNAME" || -z "$JIRA_API_TOKEN" ]]; then
  echo "❌ Usage: setup-mcp.sh <jira-url> <username> <api-token>"
  echo "        setup-mcp.sh --add-gitignore"
  exit 1
fi

MCP_FILE=".mcp.json"

JIRA_ENTRY=$(jq -n \
  --arg url "$JIRA_URL" \
  --arg user "$JIRA_USERNAME" \
  --arg token "$JIRA_API_TOKEN" \
  '{
    "command": "uvx",
    "args": ["mcp-atlassian"],
    "env": {
      "JIRA_URL": $url,
      "JIRA_USERNAME": $user,
      "JIRA_API_TOKEN": $token
    }
  }')

if [[ -f "$MCP_FILE" ]]; then
  UPDATED=$(jq --argjson entry "$JIRA_ENTRY" '.mcpServers.jira = $entry' "$MCP_FILE")
  echo "$UPDATED" > "$MCP_FILE"
  echo "✅ Updated existing $MCP_FILE with Jira MCP server."
else
  jq -n --argjson entry "$JIRA_ENTRY" '{ "mcpServers": { "jira": $entry } }' > "$MCP_FILE"
  echo "✅ Created $MCP_FILE with Jira MCP server."
fi

echo ""
cat "$MCP_FILE"
echo ""
echo "🔄 Restart Claude Code for the MCP server to activate."
