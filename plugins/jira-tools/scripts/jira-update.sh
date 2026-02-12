#!/bin/bash
set -euo pipefail
if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  exit 1
fi
TICKET_KEY="${1:?Error: Provide a ticket key}"
ACTION="${2:?Error: Provide action (summary|description|assignee|transition|label)}"
shift 2
VALUE="$*"
case "$ACTION" in
  summary)     acli jira workitem edit "$TICKET_KEY" --summary "$VALUE" ;;
  description) acli jira workitem edit "$TICKET_KEY" --description "$VALUE" ;;
  assignee)    acli jira workitem assign "$TICKET_KEY" --assignee "$VALUE" ;;
  transition)  acli jira workitem transition "$TICKET_KEY" --transition "$VALUE" ;;
  label)       acli jira workitem edit "$TICKET_KEY" --label "$VALUE" ;;
  *)
    echo "❌ Unknown action: $ACTION"
    echo "Valid: summary, description, assignee, transition, label"
    exit 1
    ;;
esac
