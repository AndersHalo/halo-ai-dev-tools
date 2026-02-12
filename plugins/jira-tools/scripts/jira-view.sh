#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/read-config.sh"
if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi
TICKET_KEY="${1:?Error: Provide a ticket key (e.g., PROJ-123)}"
echo "=== TICKET DETAILS ==="
acli jira workitem view "$TICKET_KEY" --json
echo ""
echo "=== COMMENTS ==="
acli jira workitem comment-list "$TICKET_KEY" --json 2>/dev/null || echo "(no comments)"
if [[ -n "$JIRA_BASE_URL" ]]; then
  echo ""
  echo "🔗 ${JIRA_BASE_URL}/browse/${TICKET_KEY}"
fi
