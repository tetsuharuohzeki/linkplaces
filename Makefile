NODE_BIN := node
NPM_BIN_DIR := $(shell pnpm bin)

PKG_DIR := $(CURDIR)/packages
PKG_MAIN := $(PKG_DIR)/linkplaces
PKG_MAIN_DIST_DIR := $(PKG_MAIN)/__dist

ARTIFACT_DIR := $(CURDIR)/web-ext-artifacts

PRETTIER_TARGET := '$(CURDIR)/**/*.{css,yaml,yml}'
PRETTIER_TARGET_JS := '$(CURDIR)/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'

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
clean: clean_package_main clean_webext_artifacts clean_tsbuild_info ## Clean up all generated files.

clean_webext_artifacts:
	$(NODE_BIN) $(PKG_MAIN)/tools/rm_dir.js $(ARTIFACT_DIR)

clean_tsbuild_info:
	$(NPM_BIN_DIR)/tsc --build --clean

clean_package_main:
	$(MAKE) clean -C $(PKG_MAIN)


####################################
# Build
####################################
.PHONY: build_development
build_development: clean ## Run `make build` with `RELEASE_CHANNEL=development`
	$(MAKE) $@ -C $(PKG_MAIN)

.PHONY: build_production
build_production: clean ## Run `make build` with `RELEASE_CHANNEL=production`
	$(MAKE) $@ -C $(PKG_MAIN)

__webext_xpi:
	$(NPM_BIN_DIR)/web-ext build -s $(PKG_MAIN_DIST_DIR) --artifacts-dir $(ARTIFACT_DIR)

__plain_ts:
	$(NPM_BIN_DIR)/tsc --build --force


####################################
# Test
####################################

typecheck: ## Check static typing integrity
	$(NPM_BIN_DIR)/tsc --build --emitDeclarationOnly

test: ## Run unit tests
	pnpm turbo test lint


####################################
# Lint
####################################
lint: eslint stylelint check_relationship_between_workspace_and_ts_pj_reference ## Run all lints.

eslint: ## Run ESLint
	$(NPM_BIN_DIR)/eslint '.'

eslint_fix: ## Run ESLint with --fix option
	$(NPM_BIN_DIR)/eslint '.' --fix

stylelint: ## Run stylelint
	$(NPM_BIN_DIR)/stylelint '$(CURDIR)/**/*.css' \
		--config=$(CURDIR)/stylelint.config.mjs \
		-f verbose \
		--color

check_relationship_between_workspace_and_ts_pj_reference:
	$(NPM_BIN_DIR)/workspaces-to-typescript-project-references --check


####################################
# Tools
####################################
format: format_by_prettier ## Apply formetters for files.

format_by_prettier:
	$(NPM_BIN_DIR)/prettier --write $(PRETTIER_TARGET)

format_js_by_prettier:
	$(NPM_BIN_DIR)/prettier --write $(PRETTIER_TARGET_JS)

check_format: check_format_css ## Check a code formatting.

check_format_css: ## Check CSS code formatting.
	$(NPM_BIN_DIR)/prettier --check $(PRETTIER_TARGET)

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code

