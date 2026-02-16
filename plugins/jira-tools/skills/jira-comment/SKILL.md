---
name: jira-comment
description: Add a comment to a Jira ticket. Requires ticket key and comment text.
argument-hint: [ticket-key] [comment text]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Comment on a Jira Ticket

## Read Configuration First

Before executing, read the configuration:

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.jira-config.json
```

Parse and extract: `jira_base_url`

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

## Present

After successful comment:
- Confirm the comment was added
- If `jira_base_url` is configured, show a clickable link: `<base_url>/browse/<KEY>`

## NEVER post without explicit user confirmation.
