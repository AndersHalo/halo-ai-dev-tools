# Halo Marketplace

---

## How to install it

**1. add marketplace**

Add or update this marketplace, then install the plan-refinement plugin:

```
/plugin marketplace add https://github.com/AndersHalo/halo-ai-dev-tools
```

**2. add plugins**

Install plugins:

```
/plugin install plan-refinement-plugin@halo-ai-dev-tools
/plugin install jira-tools@halo-ai-dev-tools
```

## Using the Plugins

### Jira Tools Plugin

**⚠️ Important: Configure before first use**

Before using any Jira skills, you must configure your Jira settings:

```
/jira-config
```

**Example configuration:**

- Default Project Key: `STD`
- Jira Base URL: `https://halo-powered.atlassian.net/`

```
/jira-config STD https://halo-powered.atlassian.net
```

After configuration, you can use these skills:

- `/jira-list` - List or search Jira tickets
- `/jira-view <ticket-key>` - View ticket details (e.g., `/jira-view STD-7`)
- `/jira-create` - Create a new ticket
- `/jira-comment <ticket-key>` - Add a comment to a ticket
- `/jira-update <ticket-key>` - Update ticket fields (status, assignee, summary, etc.)
- `/jira-assign <ticket-key> <assignee>` - Assign a ticket to a user

**Examples:**

```
/jira-list status="In Progress"
/jira-view STD-7
/jira-assign STD-7 user@example.com
```

### Plan Refinement Plugin

Use this plugin to refine implementation plans:

```
/plan-refinement
```

This skill helps create detailed, well-structured plans for AI execution.

## Adding plugin functionality

To add new plugins to this marketplace, follow **[PLUGINS.md](PLUGINS.md)**. It describes:

- Directory structure (`.claude-plugin/`, `commands/`, `agents/`, `skills/`, `hooks/`, `.mcp.json`, `.lsp.json`)
- How to create plugin manifests, commands, agents, skills, hooks, MCP and LSP configs
- A quick checklist for new tools
- Current contents and using `skills/plan-refinement/` as a template

Create each plugin under `plugins/<plugin-name>/` and, if you use a marketplace manifest (e.g. `.claude-plugin/marketplace.json`), add an entry there so the plugin is discovered.

## Managing marketplaces/plugins (Claude Code)

To discover, add marketplaces, and manage plugins in Claude Code, see the official docs:

- **[Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)** — browse marketplaces and install plugins
- **[Add marketplaces](https://code.claude.com/docs/en/discover-plugins#add-marketplaces)** — add from GitHub (`owner/repo`), Git URLs, local paths, or remote `marketplace.json` URLs
