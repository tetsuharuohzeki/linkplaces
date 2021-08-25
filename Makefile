PKG_DIR := $(CURDIR)/packages
PKG_MAIN := $(PKG_DIR)/linkplaces

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1

####################################
# Clean
####################################
clean: ## Clean up all generated files.
	$(MAKE) $@ -C $(PKG_MAIN)


####################################
# Build
####################################
.PHONY: build_development
build_development: ## Run `make build` with `RELEASE_CHANNEL=development`
	$(MAKE) $@ -C $(PKG_MAIN)

.PHONY: build_production
build_production: ## Run `make build` with `RELEASE_CHANNEL=production`
	$(MAKE) $@ -C $(PKG_MAIN)


####################################
# Test
####################################
typecheck: ## Check static typing integrity
	$(MAKE) $@ -C $(PKG_MAIN)
