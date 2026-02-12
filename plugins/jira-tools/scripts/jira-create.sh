#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/read-config.sh"
if ! command -v acli &> /dev/null; then
  echo "❌ Error: acli is not installed."
  echo "   https://developer.atlassian.com/cloud/acli/guides/install-acli/"
  exit 1
fi
HAS_PROJECT=false
HAS_TYPE=false
HAS_ASSIGNEE=false
for arg in "$@"; do
  case "$arg" in
    --project) HAS_PROJECT=true ;;
    --type) HAS_TYPE=true ;;
    --assignee) HAS_ASSIGNEE=true ;;
  esac
done
CMD=(acli jira workitem create "$@")
if [[ "$HAS_PROJECT" == false ]] && [[ -n "$JIRA_PROJECT" ]]; then
  CMD+=(--project "$JIRA_PROJECT")
fi
if [[ "$HAS_TYPE" == false ]] && [[ -n "$JIRA_TYPE" ]]; then
  CMD+=(--type "$JIRA_TYPE")
fi
if [[ "$HAS_ASSIGNEE" == false ]] && [[ -n "$JIRA_ASSIGNEE" ]]; then
  CMD+=(--assignee "$JIRA_ASSIGNEE")
fi
echo "🚀 Creating ticket..."
"${CMD[@]}"
