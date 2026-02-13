#!/bin/bash
set -euo pipefail
if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi
TICKET_KEY="${1:?Error: Provide a ticket key (e.g., PROJ-123)}"
shift
COMMENT="${*:?Error: Provide comment text}"
acli jira workitem comment create --key "$TICKET_KEY" --body "$COMMENT"
