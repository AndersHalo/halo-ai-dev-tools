#!/bin/bash
INPUT=$(cat)
SKILL_NAME=$(echo "$INPUT" | jq -r '.tool_input.skill_name // empty' 2>/dev/null)
if [[ "$SKILL_NAME" == jira-tools:jira-* ]]; then
  if ! command -v acli &> /dev/null; then
    echo '{"error": "Atlassian CLI (acli) not installed. See https://developer.atlassian.com/cloud/acli/guides/install-acli/"}'
    exit 1
  fi
  if ! acli jira auth status &> /dev/null; then
    echo '{"error": "Not authenticated. Run: acli jira auth login"}'
    exit 1
  fi
fi
exit 0
