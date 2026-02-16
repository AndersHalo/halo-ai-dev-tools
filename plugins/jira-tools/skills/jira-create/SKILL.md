---
name: jira-create
description: Create a Jira ticket (Task, Bug, Story, Epic). Uses default project from .jira-config.json, overrideable with --project flag.
argument-hint: [summary]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Create a Jira Ticket

Create a work item using the configured defaults from `.jira-config.json`.

## How defaults work

The script reads `.jira-config.json` for:

- **default_project** → used if `--project` is not passed
- **default_type** → used if `--type` is not passed
- **default_assignee** → used if `--assignee` is not passed

The user can override any default by passing the flag explicitly.

## Read Configuration First

Before gathering information, read the configuration:

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.jira-config.json
```

Parse and extract: `default_project`, `default_type`, `default_assignee`, `jira_base_url`

**Important:** If `default_project` is empty, inform the user they need to run `/jira-tools:jira-config` first to set up the default project.

## Gather information

If `$ARGUMENTS` is provided, use it as the summary. Then ask only for fields without a default:

1. **Summary** (required) — from `$ARGUMENTS` or ask
2. **Project** — show the default from config, ask if user wants to override
3. **Type** — show the default from config (usually Task), ask if user wants to override
4. **Description** (optional)
5. **Labels** (optional)

Show the user: "Creating ticket with defaults: project=STD, type=Task"

## Execute

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/jira-create.sh \
  --summary "<summary>" \
  [--project "<override>"] \
  [--type "<override>"] \
  [--description "<description>"] \
  [--label "<labels>"]
```

Only include `--project`, `--type`, `--assignee` if the user explicitly wants to override the default.

## Present result

- Show the created ticket key
- If `jira_base_url` is configured, show a clickable link: `<base_url>/browse/<KEY>`

## Important

- **Show the user** which defaults will be used before creating
- **Confirm** before executing
- If no default project is configured, tell the user to run `/jira-tools:jira-config` first
