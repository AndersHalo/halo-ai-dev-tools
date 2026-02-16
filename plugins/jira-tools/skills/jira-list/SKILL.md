---
name: jira-list
description: List or search Jira tickets. Uses default project from .jira-config.json. Accepts JQL or natural language queries.
argument-hint: [jql query or keywords]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# List / Search Jira Tickets

## Read Configuration First

Before building the query, read the configuration:

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.jira-config.json
```

Parse and extract: `default_project`, `jira_base_url`

## How defaults work

If no JQL is provided and a `default_project` is configured, searches within that project automatically.

If `default_project` is empty, search across all accessible projects or ask the user which project to search.

## Determine the query

| User says | JQL (uses default project if configured) |
|-----------|-----|
| "my tickets" | `project = DEFAULT AND assignee = currentUser() AND status != Done ORDER BY updated DESC` |
| "all tickets" | `project = DEFAULT ORDER BY updated DESC` |
| "in progress" | `project = DEFAULT AND status = "In Progress" ORDER BY updated DESC` |
| "bugs" | `project = DEFAULT AND type = Bug ORDER BY created DESC` |
| "sprint" | `sprint in openSprints() AND project = DEFAULT` |
| custom JQL | Use `$ARGUMENTS` as-is |

Replace `DEFAULT` with the configured project key.

## Execute

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-search.sh "<jql_query>"
```

## Present results

Parse JSON and show:
- **Key** — Summary — Status — Assignee — Priority
- Total count
- If `jira_base_url` is configured, show links for each ticket
