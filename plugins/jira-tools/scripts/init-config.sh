#!/bin/bash
set -euo pipefail
if [[ -f ".jira-config.json" ]]; then
  echo "⚠️  .jira-config.json already exists:"
  cat .jira-config.json
  exit 0
fi
PROJECT="${1:-}"
BASE_URL="${2:-}"
cat > .jira-config.json << CONF
{
  "default_project": "$PROJECT",
  "default_type": "Task",
  "default_assignee": "@me",
  "jira_base_url": "$BASE_URL"
}
CONF
echo "✅ Created .jira-config.json:"
cat .jira-config.json
echo ""
echo "💡 Edit this file to change defaults. Add to .gitignore if it contains sensitive info."
