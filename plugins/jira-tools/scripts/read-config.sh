#!/bin/bash
set -euo pipefail
CONFIG_FILE=""
if [[ -f ".jira-config.json" ]]; then
  CONFIG_FILE=".jira-config.json"
elif [[ -f "${CLAUDE_PLUGIN_ROOT:-.}/.jira-config.json" ]]; then
  CONFIG_FILE="${CLAUDE_PLUGIN_ROOT:-.}/.jira-config.json"
fi
if [[ -n "$CONFIG_FILE" ]] && command -v jq &> /dev/null; then
  raw_project=$(jq -r '.default_project // ""' "$CONFIG_FILE")
  # Jira project keys are case-sensitive and conventionally uppercase (e.g. STD); normalize to avoid "value does not exist" errors
  export JIRA_PROJECT=$([[ -n "$raw_project" ]] && echo "$raw_project" | tr '[:lower:]' '[:upper:]' || echo "")
  export JIRA_TYPE=$(jq -r '.default_type // "Task"' "$CONFIG_FILE")
  export JIRA_ASSIGNEE=$(jq -r '.default_assignee // ""' "$CONFIG_FILE")
  export JIRA_BASE_URL=$(jq -r '.jira_base_url // ""' "$CONFIG_FILE")
else
  export JIRA_PROJECT=""
  export JIRA_TYPE="Task"
  export JIRA_ASSIGNEE=""
  export JIRA_BASE_URL=""
fi
