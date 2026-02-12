#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/read-config.sh"
if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi
# Join all args as single JQL string so "project = STD ORDER BY updated" is not split
JQL="${*:-}"
if [[ -z "$JQL" ]]; then
  if [[ -n "$JIRA_PROJECT" ]]; then
    JQL="project = $JIRA_PROJECT AND assignee = currentUser() AND status != Done ORDER BY updated DESC"
  else
    JQL="assignee = currentUser() AND status != Done ORDER BY updated DESC"
  fi
fi
acli jira workitem search --jql "$JQL" --json
