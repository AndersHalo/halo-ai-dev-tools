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
/plugin install jira-mcp-setup@halo-ai-dev-tools
```

## Using the Plugins

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
4. Ask if you want to add `.mcp.json` to `.gitignore` (recommended — the file contains your API token)
5. After restarting Claude Code, the Jira MCP server will be available

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
