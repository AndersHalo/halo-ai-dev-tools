---
name: jira-assign
description: Assign a Jira ticket to a user. Use with ticket key and assignee (name, email, or accountId).
argument-hint: [ticket-key] [assignee]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Assign Jira Ticket

## Get Parameters

1. **Ticket Key** from `$ARGUMENTS` (e.g., PROJ-123)
2. **Assignee** - can be:
   - **Display Name** (e.g., "Franklin Lee", "David") - Automatically searches in the project
   - Email address (e.g., user@example.com)
   - Account ID (e.g., 712020:8f3b3534-3191-4857-a039-2858a69cdd89)
   - Special values: `@me` (self-assign) or `default` (project default assignee)

If either parameter is missing, ask the user for it.

**Note:** Name search is case-insensitive and supports partial matches. If multiple users match, the script will show options.

## Execute

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-assign.sh "<ticket-key>" "<assignee>"
```

## Present

After successful assignment, display:
- **Assignee Display Name**
- **Account ID**
- **Link** to ticket if `jira_base_url` is configured

The script will automatically fetch and display the updated assignee information after assignment.
