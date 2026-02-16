#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/read-config.sh"

if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo "❌ Error: jq is not installed."
  exit 1
fi

TICKET_KEY="${1:?Error: Provide a ticket key (e.g., PROJ-123)}"
ASSIGNEE="${2:?Error: Provide assignee (email, accountId, or name)}"

# Function to search for users by display name in the project
search_user_by_name() {
  local search_name="$1"
  local project_key

  # Extract project key from ticket key (e.g., STD-7 -> STD)
  project_key="${TICKET_KEY%%-*}"

  echo "🔍 Searching for user '$search_name' in project $project_key..." >&2

  # Search for assignees in the project and filter by name
  local results
  results=$(acli jira workitem search \
    --jql "project = $project_key AND assignee is not EMPTY" \
    --fields "assignee" \
    --json 2>/dev/null \
    | jq -r --arg name "$search_name" '
      .[].fields.assignee
      | select(. != null)
      | select(.displayName | ascii_downcase | contains($name | ascii_downcase))
      | "\(.displayName)|\(.accountId)"
    ' | sort -u)

  if [[ -z "$results" ]]; then
    echo "❌ No users found matching '$search_name'" >&2
    return 1
  fi

  local count
  count=$(echo "$results" | wc -l | tr -d ' ')

  if [[ "$count" -eq 1 ]]; then
    local display_name account_id
    display_name=$(echo "$results" | cut -d'|' -f1)
    account_id=$(echo "$results" | cut -d'|' -f2)
    echo "✓ Found: $display_name" >&2
    echo "$account_id"
    return 0
  else
    echo "❌ Multiple users found matching '$search_name':" >&2
    echo "$results" | nl >&2
    echo "" >&2
    echo "Please be more specific or use email/Account ID directly." >&2
    return 1
  fi
}

# Function to assign ticket
assign_ticket() {
  local assignee="$1"

  # Check if assignee is an Account ID (format: numbers:uuid)
  if [[ "$assignee" =~ ^[0-9]+:.+ ]]; then
    echo "📝 Using JSON method for Account ID format..."
    acli jira workitem edit --from-json <(cat <<EOF
{
  "assignee": "$assignee",
  "issues": ["$TICKET_KEY"]
}
EOF
) --yes
  else
    # For emails, @me, or default - use standard assign command
    acli jira workitem assign --key "$TICKET_KEY" --assignee "$assignee"
  fi
}

echo "Assigning ticket $TICKET_KEY to $ASSIGNEE..."
echo ""

# Determine assignee type and process accordingly
if [[ "$ASSIGNEE" =~ ^[0-9]+:.+ ]]; then
  # Account ID format
  assign_ticket "$ASSIGNEE"

elif [[ "$ASSIGNEE" =~ @.*\..+ ]]; then
  # Email format
  assign_ticket "$ASSIGNEE"

elif [[ "$ASSIGNEE" == "@me" ]] || [[ "$ASSIGNEE" == "default" ]]; then
  # Special values
  assign_ticket "$ASSIGNEE"

else
  # Assume it's a display name - search for it
  ACCOUNT_ID=$(search_user_by_name "$ASSIGNEE")
  if [[ $? -eq 0 ]]; then
    echo ""
    assign_ticket "$ACCOUNT_ID"
  else
    exit 1
  fi
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
