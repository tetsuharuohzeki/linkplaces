NODE_BIN := node
NPM_BIN_DIR := $(shell pnpm bin)


ARTIFACT_DIR := $(CURDIR)/web-ext-artifacts

PRETTIER_TARGET := '$(CURDIR)/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,css,yaml,yml}'

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
	$(NPM_BIN_DIR)/tsc --build --emitDeclarationOnly

test: ## Run unit tests
	$(NPM_BIN_DIR)/turbo test


####################################
# Lint
####################################
lint: eslint check_relationship_between_workspace_and_ts_pj_reference ## Run all lints.

eslint: ## Run ESLint
	$(NPM_BIN_DIR)/turbo eslint

eslint_fix: ## Run ESLint with --fix option
	$(NPM_BIN_DIR)/turbo eslint -- --fix

check_relationship_between_workspace_and_ts_pj_reference:
	$(NPM_BIN_DIR)/workspaces-to-typescript-project-references --check


####################################
# Tools
####################################
format: ## Apply formetters for files.
	$(NPM_BIN_DIR)/prettier --write $(PRETTIER_TARGET)

format_check: ## Check a code formatting.
	$(NPM_BIN_DIR)/prettier --check $(PRETTIER_TARGET)

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code

