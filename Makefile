NODE_BIN := node
NPM_MOD_DIR := $(CURDIR)/node_modules
NPM_BIN := $(NPM_MOD_DIR)/.bin

PKG_DIR := $(CURDIR)/packages
PKG_MAIN := $(PKG_DIR)/linkplaces

export ARTIFACT_DIR := $(CURDIR)/web-ext-artifacts

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1

####################################
# Clean
####################################
clean: clean_webext_artifacts clean_tsbuild_info ## Clean up all generated files.
	$(MAKE) $@ -C $(PKG_MAIN)

clean_webext_artifacts:
	$(NODE_BIN) $(PKG_MAIN)/tools/rm_dir.js $(ARTIFACT_DIR)

clean_tsbuild_info:
	$(NPM_BIN)/tsc --build --clean


####################################
# Build
####################################
.PHONY: build_development
build_development: clean ## Run `make build` with `RELEASE_CHANNEL=development`
	$(MAKE) $@ -C $(PKG_MAIN)

.PHONY: build_production
build_production: clean ## Run `make build` with `RELEASE_CHANNEL=production`
	$(MAKE) $@ -C $(PKG_MAIN)


####################################
# Test
####################################
typecheck: ## Check static typing integrity
	$(MAKE) $@ -C $(PKG_MAIN)
