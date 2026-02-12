---
name: jira-view
description: View details of a Jira ticket including description and comments. Use with a ticket key like PROJ-123.
argument-hint: [ticket-key]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# View Jira Ticket Details

## Execute

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-view.sh $ARGUMENTS
```

If `$ARGUMENTS` is empty, ask for the ticket key.

## Present

- **Key & Summary** (header)
- **Status** / **Priority** / **Type**
- **Assignee** / **Reporter**
- **Description** (formatted)
- **Labels** / **Components** / **Sprint**
- **Created** / **Updated**
- **Comments** (most recent, with author and date)
- **Link** to ticket if `jira_base_url` is configured
