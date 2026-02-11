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
```

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
