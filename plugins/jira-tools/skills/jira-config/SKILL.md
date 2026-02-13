---
name: jira-config
description: Initialize or view Jira configuration for this project. Sets default project, type, and assignee.
argument-hint: [project-key] [base-url]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Configure Jira Defaults

Initialize or view the `.jira-config.json` file for the current project.

## If `$ARGUMENTS` is provided

Use the first argument as the project key, second (optional) as the base URL:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/init-config.sh "$0" "$1"
```

Example: `/jira-tools:jira-config PROJ https://mycompany.atlassian.net`

## If no arguments

1. Check if `.jira-config.json` exists in the current directory
2. If yes, show its contents
3. If no, ask the user for:
   - **Project key** (required) — e.g., PROJ, TEAM, DEV
   - **Jira base URL** (optional) — e.g., `https://mycompany.atlassian.net`

Then run:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/init-config.sh "<project>" "<base_url>"
```

## Config file format

```json
{
  "default_project": "PROJ",
  "default_type": "Task",
  "default_assignee": "@me",
  "jira_base_url": "https://mycompany.atlassian.net"
}
```

The user can edit this file manually to change `default_type` or `default_assignee`.

## Tip

Suggest adding `.jira-config.json` to `.gitignore` if it contains sensitive info.
