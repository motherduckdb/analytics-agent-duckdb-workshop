FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

ARG TARGETARCH

# ---- System deps ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    zsh \
    git \
    zstd \
    ripgrep \
    && rm -rf /var/lib/apt/lists/*

# ---- uv (Python package manager) ----
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# ---- Ollama (install script auto-detects arch) ----
RUN curl -fsSL https://ollama.com/install.sh | sh

# ---- Switch to vscode user ----
USER vscode
ENV PATH="/home/vscode/.local/bin:${PATH}"

# ---- DuckDB CLI + FastMCP via uv ----
RUN uv tool install duckdb-cli && \
    uv tool install fastmcp
