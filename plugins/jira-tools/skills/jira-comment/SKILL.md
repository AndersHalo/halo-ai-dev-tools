---
name: jira-comment
description: Add a comment to a Jira ticket. Requires ticket key and comment text.
argument-hint: [ticket-key] [comment text]
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Comment on a Jira Ticket

## Parse arguments

- `$0` = Ticket key (e.g., PROJ-123)
- Rest = Comment text
- If missing, ask the user

## Confirm before posting

Show exactly what will be posted:
> **Adding comment to PROJ-123:**
> "The comment text"
>
> Proceed?

## Execute (only after confirmation)

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-comment.sh "<ticket-key>" "<comment>"
```

## NEVER post without explicit user confirmation.
