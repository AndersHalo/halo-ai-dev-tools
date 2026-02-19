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
/plugin install jira-mcp-setup@halo-ai-dev-tools
```

## Using the Plugins

### Jira Tools Plugin

**Prerequisites**

Before using the Jira Tools plugin, you must:

1. **Install Jira CLI** - Install the Atlassian Jira CLI tool on your system
2. **Authenticate** - Run the authentication command:
   ```bash
   jira auth login
   ```

   Follow the prompts to authenticate with your Atlassian account. See the [official documentation](https://developer.atlassian.com/cloud/acli/reference/commands/jira-auth-login/) for detailed instructions.

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

### Jira MCP Setup Plugin

This plugin installs and configures the `mcp-atlassian` MCP server, giving Claude Code direct access to Jira via the Model Context Protocol.

**Prerequisites**

- Python 3
- [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- `jq` (`brew install jq`)
- A Jira API token — generate one at https://id.atlassian.com/manage-profile/security/api-tokens

**Setup**

```
/jira-mcp-setup
```

Or pass all values directly:

```
/jira-mcp-setup https://mycompany.atlassian.net user@example.com YOUR_API_TOKEN
```

The skill will:
1. Verify dependencies are installed
2. Ask for Jira URL, email, and API token (if not provided)
3. Create or update `.mcp.json` in the project root
4. After restarting Claude Code, the Jira MCP server will be available

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
