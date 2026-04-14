# SQL is Dead, Long Live SQL : Engineering reliable analytics agents from scratch

> [PyCon DE & PyData 2026](https://pretalx.com/pyconde-pydata-2026/talk/AF9DNH/) — April 14, 11:45, Dynamicum [Ground Floor]
> 90-minute hands-on tutorial by **Mehdi Ouazza** and **Dumky de Wilde**

## Repo structure

```
workshop/                      <-- START HERE
├── duckoffee.duckdb           # Dataset: a coffee-shop chain across 13 cities
├── skill.md                   # Agent instructions (semantic layer)
├── pyproject.toml             # Python deps: duckdb, pydantic-ai, fastmcp, openai
├── Makefile                   # make setup
└── (your code)                # agent_loop.py, agent_tools.py, mcp-server/, …

solutions/                     # Reference implementations for every part

site/                          # Slide deck (Next.js → GitHub Pages)
└── src/content/*.mdx          # One MDX file per part

.devcontainer/                 # Codespace / devcontainer (Python, uv, opencode)
```

**All exercises happen inside `workshop/`.** Clone the repo, `cd workshop`, and follow the slides.

## Get started

### 1. Clone

```bash
git clone https://github.com/motherduckdb/analytics-agent-duckdb-workshop.git
cd analytics-agent-duckdb-workshop/workshop
```

### 2. Install tools

You need **Python 3.10+**, **uv**, and **opencode**:

```bash
# uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# opencode (agentic CLI)
curl -fsSL https://opencode.ai/install | bash

# workshop Python deps
uv sync
```

### 3. Get your model key

Pick one:

| Option | How |
|--------|-----|
| **MotherDuck-minted key** (recommended) | Go to **[motherduck.com/minter](https://motherduck.com/minter)** — pre-funded, no signup hassle |
| **Bring your own key** | OpenRouter, Anthropic, or OpenAI — any provider that speaks the OpenAI chat API |

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
```

### 4. Verify

```bash
python3 --version   # 3.10+
uv --version
duckdb --version
opencode --version
```

### Bonus: Devcontainer (zero local install)

Don't want to install Python/uv/opencode? Open the repo in a **GitHub Codespace** — everything is pre-installed, you just bring your key.

```bash
gh codespace create --repo motherduckdb/analytics-agent-duckdb-workshop
```

## Workshop outline

| Part | Topic | Time |
|------|-------|------|
| 1 | DuckDB from Python | 10 min |
| 2 | Text-to-SQL & the agentic loop | 15 min |
| 3 | Context: skill file + COMMENT ON | 15 min |
| 4 | Deterministic tools with PydanticAI | 20 min |
| 5 | Distribute via FastMCP | 15 min |

## Links

- **Slides**: [motherduck.com/pyconde2026](https://motherduck.com/pyconde2026)
- **Model key**: [motherduck.com/minter](https://motherduck.com/minter)
- **DuckDB docs**: [duckdb.org/docs](https://duckdb.org/docs)
- **PydanticAI docs**: [docs.pydantic.dev/pydantic-ai](https://docs.pydantic.dev/pydantic-ai)
- **FastMCP**: [github.com/jlowin/fastmcp](https://github.com/jlowin/fastmcp)

## License

Workshop materials for PyCon DE & PyData 2026.
