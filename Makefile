NODE_BIN := node
NPM_BIN_DIR := $(shell pnpm bin)


all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1

####################################
# Setup
####################################
setup_corepack:
	corepack enable
	corepack prepare pnpm@latest --activate

install: ## Install dependencies
	pnpm install


####################################
# Clean
####################################
clean: ## Clean up all generated files.
	$(NPM_BIN_DIR)/turbo clean


####################################
# Build
####################################
.PHONY: build_debug
build_debug:  ## Run `make build` with `RELEASE_CHANNEL=development`
	env RELEASE_CHANNEL=development $(NPM_BIN_DIR)/turbo run '//#build:package'

.PHONY: build_release
build_release: ## Run `make build` with `RELEASE_CHANNEL=production`
	env RELEASE_CHANNEL=production $(NPM_BIN_DIR)/turbo run '//#build:package'


####################################
# Test
####################################

typecheck: ## Check static typing integrity
	$(NODE_BIN) --run typecheck

test: ## Run unit tests
	$(NPM_BIN_DIR)/turbo test


####################################
# Lint
####################################
lint: ## Run all lints.
	$(NPM_BIN_DIR)/turbo run lint

eslint: ## Run ESLint
	$(NPM_BIN_DIR)/turbo eslint

eslint_fix: ## Run ESLint with --fix option
	$(NPM_BIN_DIR)/turbo eslint -- --fix


####################################
# Tools
####################################
format: ## Apply formetters for files.
	$(NODE_BIN) --run format

format_check: ## Check a code formatting.
	$(NODE_BIN) --run 'format:check'

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code

