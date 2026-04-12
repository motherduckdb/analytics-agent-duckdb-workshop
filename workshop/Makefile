IMAGE_NAME := pycon-workshop
CONTAINER_NAME := pycon-workshop
ARCH := $(shell uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/')
REPO_ROOT := $(shell cd .. && pwd)

.PHONY: help setup pull data status build run shell stop clean

# ──── Local (no Docker) ──────────────────────────────────

## setup    : Install Python deps with uv
setup:
	uv sync

## pull     : Start Ollama (if needed) and pull Gemma 4 (9.6 GB)
pull:
	@if ! command -v ollama >/dev/null 2>&1; then \
		echo "Error: ollama not found. Install it from https://ollama.com"; \
		exit 1; \
	fi
	@if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then \
		echo "==> Starting Ollama..."; \
		ollama serve &>/dev/null & \
		for i in $$(seq 1 30); do \
			curl -sf http://localhost:11434/api/tags >/dev/null 2>&1 && break; \
			sleep 2; \
		done; \
		if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then \
			echo "Error: Ollama failed to start."; \
			exit 1; \
		fi; \
	fi
	ollama pull gemma4:latest

## data     : Generate workshop datasets
data:
	python3 data/generate.py

## status   : Show Ollama models
status:
	@ollama list 2>/dev/null || echo "Ollama not running."

# ──── Docker ─────────────────────────────────────────────

## build    : Build the workshop container image
build:
	docker build --platform linux/$(ARCH) -t $(IMAGE_NAME) -f $(REPO_ROOT)/.devcontainer/Dockerfile $(REPO_ROOT)

## run      : Start the workshop container (build + post-create + post-start)
run: build
	docker run -d --name $(CONTAINER_NAME) --platform linux/$(ARCH) \
		-v $(REPO_ROOT):/workspace -w /workspace -p 11434:11434 \
		$(IMAGE_NAME) sleep infinity
	docker exec $(CONTAINER_NAME) bash /workspace/.devcontainer/post-create.sh
	docker exec $(CONTAINER_NAME) bash /workspace/.devcontainer/post-start.sh

## shell    : Open a shell in the running container
shell:
	docker exec -it $(CONTAINER_NAME) zsh

## stop     : Stop and remove the workshop container
stop:
	docker stop $(CONTAINER_NAME) 2>/dev/null || true
	docker rm $(CONTAINER_NAME) 2>/dev/null || true

## clean    : Remove container and image
clean: stop
	docker rmi $(IMAGE_NAME) 2>/dev/null || true

## help     : Show this help
help:
	@sed -n 's/^## //p' $(MAKEFILE_LIST) | column -t -s ':'
