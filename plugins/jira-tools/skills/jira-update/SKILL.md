---
name: jira-update
description: Update a Jira ticket (status, assignee, summary, description, labels).
argument-hint: [ticket-key]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Update a Jira Ticket

## Read Configuration First

Before executing, read the configuration:

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.jira-config.json
```

Parse and extract: `jira_base_url`

## Get ticket key from `$ARGUMENTS`, or ask.

## Available actions

| Change      | Command                                       |
| ----------- | --------------------------------------------- |
| Summary     | `jira-update.sh KEY summary "New title"`      |
| Description | `jira-update.sh KEY description "New desc"`   |
| Assignee    | `jira-update.sh KEY assignee "email"`         |
| Status      | `jira-update.sh KEY transition "In Progress"` |
| Labels      | `jira-update.sh KEY label "a,b"`              |

## Execute (only after confirmation)

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-update.sh "<key>" "<action>" "<value>"
```

## Present

After successful update:
- Confirm what was changed
- If `jira_base_url` is configured, show a clickable link: `<base_url>/browse/<KEY>`

## Always confirm changes before executing.
