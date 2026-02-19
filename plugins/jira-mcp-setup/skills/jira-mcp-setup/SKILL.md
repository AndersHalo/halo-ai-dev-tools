---
name: jira-mcp-setup
description: Install and configure the Jira MCP server (mcp-atlassian) for Claude Code. Sets up .mcp.json with Jira credentials.
argument-hint: [jira-url] [username] [api-token]
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/*)
---

# Setup Jira MCP Server

Install and configure the `mcp-atlassian` MCP server so Claude Code can interact with Jira directly.

## Step 1 — Check Dependencies

Run the dependency check:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/check-deps.sh
```

If dependencies are missing, show the error output to the user and **stop here**. Do not proceed until all dependencies are satisfied.

## Step 2 — Gather Credentials

### If `$ARGUMENTS` provides all three values

Use them in order: `<jira-url> <username> <api-token>`.

Example: `/jira-mcp-setup https://mycompany.atlassian.net user@example.com ATATT3x...`

### If arguments are missing or incomplete

Ask the user for each missing value:

1. **Jira URL** (required) — The Atlassian instance URL, e.g. `https://mycompany.atlassian.net`
2. **Username / Email** (required) — The email used to log in to Jira Cloud. The user can find it at https://id.atlassian.com/manage-profile
3. **API Token** (required) — The user must generate one at https://id.atlassian.com/manage-profile/security/api-tokens. Steps: click "Create API token", give it a name (e.g. "Claude Code"), and copy the token

## Step 3 — Configure MCP

Run the setup script with the collected values:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/setup-mcp.sh "<jira-url>" "<username>" "<api-token>"
```

## Step 4 — Protect Credentials

The `.mcp.json` file contains the API token in plain text. **Ask the user** if they want to add `.mcp.json` to `.gitignore` to prevent accidentally committing secrets.

- If `.mcp.json` is already listed in `.gitignore`, skip this step.
- If the user accepts, run:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/setup-mcp.sh --add-gitignore
```

- If the user declines, warn them that the file contains sensitive credentials and should not be pushed to a remote repository.

## Step 5 — Present Result

After successful setup, tell the user:

1. The `.mcp.json` file has been created/updated in the project root
2. Whether `.mcp.json` was added to `.gitignore`
3. **Restart Claude Code** (or start a new conversation) for the Jira MCP server to activate
4. Once active, Claude will have direct access to Jira tools (search issues, create tickets, add comments, etc.)

## Troubleshooting

If the user reports issues after setup:
- Verify the API token is valid at https://id.atlassian.com/manage-profile/security/api-tokens
- Ensure the Jira URL does not have a trailing slash
- Run `uvx mcp-atlassian` manually to test the server starts correctly
