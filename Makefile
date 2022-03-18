NODE_BIN := node
YARNPKG_RUN_BIN := yarn run --binaries-only

PKG_DIR := $(CURDIR)/packages
PKG_MAIN := $(PKG_DIR)/linkplaces
PKG_MAIN_DIST_DIR := $(PKG_MAIN)/__dist

ARTIFACT_DIR := $(CURDIR)/web-ext-artifacts

ESLINT_TARGET_EXTENSION := js,jsx,cjs,mjs,ts,tsx,cts,mts
PRETTIER_TARGET := '$(CURDIR)/**/*.{css,yaml,yml}'
PRETTIER_TARGET_JS := '$(CURDIR)/**/*.{$(ESLINT_TARGET_EXTENSION)}'

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1

####################################
# Setup
####################################
setup_yarnpkg:
	corepack enable yarn

install: ## Install dependencies
	yarn install --immutable


####################################
# Clean
####################################
clean: clean_package_main clean_webext_artifacts clean_tsbuild_info ## Clean up all generated files.

clean_webext_artifacts:
	$(NODE_BIN) $(PKG_MAIN)/tools/rm_dir.js $(ARTIFACT_DIR)

clean_tsbuild_info:
	$(YARNPKG_RUN_BIN) tsc --build --clean

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
	$(YARNPKG_RUN_BIN) web-ext build -s $(PKG_MAIN_DIST_DIR) --artifacts-dir $(ARTIFACT_DIR)

__plain_ts:
	$(YARNPKG_RUN_BIN) tsc --build --force


####################################
# Test
####################################

typecheck: ## Check static typing integrity
	$(YARNPKG_RUN_BIN) tsc --build


####################################
# Lint
####################################
lint: eslint stylelint ## Run all lints.

eslint: ## Run ESLint
	$(YARNPKG_RUN_BIN) eslint --ext=$(ESLINT_TARGET_EXTENSION) $(CURDIR)

eslint_fix: ## Run ESLint with --fix option
	$(YARNPKG_RUN_BIN) eslint --ext=$(ESLINT_TARGET_EXTENSION) $(CURDIR) --fix

stylelint: ## Run stylelint
	$(YARNPKG_RUN_BIN) stylelint '$(CURDIR)/**/*.css' \
		--config=$(CURDIR)/stylelint.config.cjs \
		-f verbose \
		--color


####################################
# Tools
####################################
format: format_by_prettier ## Apply formetters for files.

format_by_prettier:
	$(YARNPKG_RUN_BIN) prettier --write $(PRETTIER_TARGET)

format_js_by_prettier:
	$(YARNPKG_RUN_BIN) prettier --write $(PRETTIER_TARGET_JS)

check_format: check_format_css ## Check a code formatting.

check_format_css: ## Check CSS code formatting.
	$(YARNPKG_RUN_BIN) prettier --check $(PRETTIER_TARGET)

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code

