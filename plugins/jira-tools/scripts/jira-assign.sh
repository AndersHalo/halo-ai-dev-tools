#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/read-config.sh"

if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi

TICKET_KEY="${1:?Error: Provide a ticket key (e.g., PROJ-123)}"
ASSIGNEE="${2:?Error: Provide assignee (email or accountId)}"

echo "Assigning ticket $TICKET_KEY to $ASSIGNEE..."

# If assignee looks like an Account ID with colons, use JSON method
if [[ "$ASSIGNEE" =~ ^[0-9]+:.+ ]]; then
  echo "Using JSON method for Account ID format..."
  acli jira workitem edit --from-json <(cat <<EOF
{
  "assignee": "$ASSIGNEE",
  "issues": ["$TICKET_KEY"]
}
EOF
) --yes
else
  # For emails or @me, use the standard assign command
  acli jira workitem assign --key "$TICKET_KEY" --assignee "$ASSIGNEE"
fi

echo "✅ Ticket assigned successfully!"
echo ""

# Show the updated assignee info
echo "=== UPDATED ASSIGNEE INFO ==="
acli jira workitem view "$TICKET_KEY" --json | jq -r '{
  assignee: (.fields.assignee.displayName // "Unassigned"),
  accountId: (.fields.assignee.accountId // "N/A")
}'

if [[ -n "$JIRA_BASE_URL" ]]; then
  echo ""
  echo "🔗 ${JIRA_BASE_URL}/browse/${TICKET_KEY}"
fi
