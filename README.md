# SQL is Dead, Long Live SQL : Engineering reliable analytics agents from scratch

> [PyCon DE & PyData 2026](https://pretalx.com/pyconde-pydata-2026/talk/AF9DNH/) — April 14, 11:45, Dynamicum [Ground Floor]
> 90-minute hands-on tutorial by **Mehdi Ouazza** and **Dumky de Wilde**

Is SQL still worth learning in 2026? We test Text-to-SQL to its limits — ambiguity, hallucinations, dirty data — then build practical solutions. You'll construct a local analytics agent using DuckDB, MCP, and a semantic layer.

## Prerequisites

- **Python 3.10+** and beginner SQL (joins, aggregations)
- No prior AI/LLM experience required
- One of the setups below

## Setup Options

### Option A: GitHub Codespace (recommended, zero install)

Click **"Use this template"** → **"Open in a codespace"**. Everything is pre-installed. You land in `workshop/` ready to go.

### Option B: Local with Docker

Requires: [Docker](https://docs.docker.com/get-docker/) and [uv](https://docs.astral.sh/uv/)

```bash
cd workshop
make setup          # install Python deps
make pull           # pull Gemma 4 via Ollama (9.6 GB — needs bandwidth)
```

Uses **Ollama + Gemma 4** (fully local, no API key) and **opencode** as the agentic CLI.

### Option C: Local with Anthropic API key

Requires: [uv](https://docs.astral.sh/uv/) and an [Anthropic API key](https://console.anthropic.com/)

```bash
cd workshop
make setup
export ANTHROPIC_API_KEY=sk-ant-...
```

Uses **Claude** via API and **Claude Code** as the agentic CLI:

```bash
npm install -g @anthropic-ai/claude-code
claude
```

### Option D: Mix and match

You can use any combination:
- **Model**: Anthropic API (Claude) or Ollama (Gemma 4, fully local)
- **Agentic CLI**: Claude Code (Anthropic) or opencode (Ollama)
- **Python agent**: PydanticAI works with both (`"anthropic:claude-sonnet-4-20250514"` or `"ollama:gemma4:latest"`)

## Workshop Outline

| Part | Topic | Time |
|------|-------|------|
| 0 | Setup | 5 min |
| 1 | DuckDB from Python | 10 min |
| 2 | Text-to-SQL & the agentic loop | 15 min |
| 3 | Context: skill file + semantic layer | 15 min |
| 4 | Deterministic tools with PydanticAI | 20 min |
| 5 | Distribute via FastMCP | 15 min |

## Repo Structure

```
workshop/                      ← STUDENTS work here
├── duckoffee.duckdb           # Duckoffee e-commerce dataset
├── skill.md                   # Agent instructions (semantic layer)
├── pyproject.toml             # Python deps: duckdb, pydantic-ai, fastmcp
├── Makefile                   # make setup, make pull, make status
└── (your code here)           # agent_loop.py, agent_tools.py, etc.

site/                          ← Course website (GitHub Pages)
├── src/content/               # MDX content — one file per part
│   ├── 00-setup.mdx
│   ├── 01-duckdb.mdx
│   ├── 02-loop.mdx
│   ├── 03-context.mdx
│   ├── 04-tools.mdx
│   └── 05-mcp.mdx
├── src/components/            # React UI: CopyBlock, Quiz, animations
└── package.json               # Next.js + MDX

.devcontainer/                 # Codespace / devcontainer config
.github/workflows/deploy.yml   # Deploys site/ to GitHub Pages
```

## Course Website

The course content is a Next.js static site deployed to GitHub Pages. Students follow along on the site; the presenter navigates blocks with arrow keys.

### Editing content

All course content lives in `site/src/content/*.mdx`. Each file is one part of the workshop. Blocks are separated by `---` (horizontal rules). Components available in MDX:

- `<CopyBlock text="..." />` — code block with copy button and syntax highlighting
- `<Quiz question="..." options={[...]} correct={N} />` — inline quiz
- `<Tip>...</Tip>` — callout box
- `<Badge color="...">...</Badge>` — colored label
- `<AgenticLoop />` — animated agentic loop diagram

### Running the site locally

```bash
cd site
npm install
npm run dev        # http://localhost:3000
```

### Building for production

```bash
cd site
npm run build      # static output in site/out/
```

## Suggested repo name

`sql-is-dead-long-live-sql` or `analytics-agent-workshop`

## License

Workshop materials for PyCon DE & PyData 2026.
