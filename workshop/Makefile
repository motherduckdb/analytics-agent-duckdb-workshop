IMAGE_NAME := pycon-workshop
CONTAINER_NAME := pycon-workshop
ARCH := $(shell uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/')
REPO_ROOT := $(shell cd .. && pwd)

.PHONY: help setup data build run shell stop clean

# ──── Local (no Docker) ──────────────────────────────────

## setup    : Install Python deps with uv
setup:
	uv sync

## data     : Generate workshop datasets
data:
	python3 data/generate.py

# ──── Docker ─────────────────────────────────────────────

## build    : Build the workshop container image
build:
	docker build --platform linux/$(ARCH) -t $(IMAGE_NAME) -f $(REPO_ROOT)/.devcontainer/Dockerfile $(REPO_ROOT)

## run      : Start the workshop container (build + post-create + post-start)
run: build
	docker run -d --name $(CONTAINER_NAME) --platform linux/$(ARCH) \
		-v $(REPO_ROOT):/workspace -w /workspace \
		-e OPENROUTER_API_KEY \
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
