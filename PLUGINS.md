# Halo — dev plugins

---

## Adding more plugins

You can add more plugins to this marketplace at any time. Create a new folder under `plugins/` (e.g. `plugins/my-new-plugin/`) and follow the directory structure below for each plugin. If your setup uses a marketplace manifest (e.g. `.claude-plugin/marketplace.json`), add an entry there so the new plugin is discovered. Each plugin is self-contained with its own `.claude-plugin/plugin.json`, commands, skills, and agents.

---

## Directory structure

| Directory / File      | Location    | Purpose                                                                        |
| --------------------- | ----------- | ------------------------------------------------------------------------------ |
| **`.claude-plugin/`** | Plugin root | Plugin manifest (`plugin.json`). Optional if components use default locations. |
| **`commands/`**       | Plugin root | Skills exposed as Markdown files (commands the model can run).                 |
| **`agents/`**         | Plugin root | Custom agent definitions.                                                      |
| **`skills/`**         | Plugin root | Agent Skills: each skill lives in its own folder with a `SKILL.md` file.       |
| **`hooks/`**          | Plugin root | Event handlers defined in `hooks.json`.                                        |
| **`.mcp.json`**       | Plugin root | MCP server configurations.                                                     |
| **`.lsp.json`**       | Plugin root | LSP server configurations for code intelligence.                               |

---

## Getting started

### 1. Plugin manifest (`.claude-plugin/`)

- **`plugin.json`** — Name, description, version, author. Already present in this repo.
- Add or edit this when you want to change plugin metadata or default paths.

### 2. Commands (`commands/`)

- Put **Markdown files** here to define skills that act as runnable commands.
- One command per file; the model can invoke these by name or description.
- Create the folder if missing: `mkdir -p commands`.

### 3. Agents (`agents/`)

- Define **custom agents** (personas, system prompts, tool sets) here.
- Use this when you need a dedicated agent type beyond the default.
- Create the folder if missing: `mkdir -p agents`.

### 4. Skills (`skills/`)

- **Agent Skills** live in subfolders, each with a **`SKILL.md`** file.
- `SKILL.md` describes when to use the skill, steps, and any rules the model should follow.
- Example: `skills/plan-refinement/SKILL.md` is already in this repo.
- To add a skill: create `skills/<skill-name>/SKILL.md` and write the skill instructions.

### 5. Hooks (`hooks/`)

- **`hooks.json`** in `hooks/` defines **event handlers** (e.g. on startup, on file change).
- Create `hooks/` and add `hooks.json` when you need lifecycle or event-driven behavior.

### 6. MCP (`.mcp.json`)

- **MCP server configs** for external tools (APIs, databases, custom servers).
- Add `.mcp.json` at the plugin root when you want to wire in MCP servers.

### 7. LSP (`.lsp.json`)

- **LSP server configs** for **code intelligence** (completion, go-to-definition, diagnostics).
- Add `.lsp.json` at the plugin root when you need language servers inside the plugin.

---

## Quick checklist for new tools

1. **New command** → Add a Markdown file under `commands/`.
2. **New agent skill** → Add `skills/<name>/SKILL.md`.
3. **New agent type** → Add definition under `agents/`.
4. **Events / lifecycle** → Use `hooks/hooks.json`.
5. **External services** → Configure in `.mcp.json`.
6. **Language / IDE features** → Configure in `.lsp.json`.

---

## Current contents

- **Plugin:** `.claude-plugin/plugin.json` (name, description, version, author).
- **Skills:** `skills/plan-refinement/SKILL.md` (example skill).

You can use `skills/plan-refinement/` as a template for new skills under `skills/<your-skill-name>/SKILL.md`.

---
