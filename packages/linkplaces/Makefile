NODE_BIN := node
NPM_BIN_DIR := $(shell pnpm bin)

REPOSITORY_ROOT_DIR := $(abspath $(CURDIR)/../..)

SRC_DIR := $(CURDIR)/src
PLAIN_DIR := $(CURDIR)/__plain
OBJ_DIR := $(CURDIR)/__obj
OBJ_SRC_DIR := $(OBJ_DIR)/src
DIST_DIR := $(CURDIR)/__dist

export RELEASE_CHANNEL ?= production

# ifeq ($(RELEASE_CHANNEL),production)
# endif

# Sorry. These are depends on *nix way...
export GIT_REVISION := $(shell git rev-parse --verify HEAD)
export BUILD_DATE := $(shell date -u '+%Y-%m-%d %T%z')

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1


####################################
# Bootstrap
####################################


####################################
# Clean
####################################
clean: clean_compiler_info clean_dist clean_obj clean_plain ## Clean up all generated files.

clean_compiler_info:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(CURDIR)/tsconfig.tsbuildinfo --force

clean_dist:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(DIST_DIR) --force

clean_obj:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(OBJ_DIR) --force

clean_plain:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(PLAIN_DIR) --force


####################################
# Build
####################################
__bundle_js_%:
	RELEASE_CHANNEL=$(RELEASE_CHANNEL) $(NPM_BIN_DIR)/rollup $(OBJ_SRC_DIR)/$*/index.js --config $(CURDIR)/rollup.config.mjs --output.file $(DIST_DIR)/$*/$*_bundled.js

__bundle_css_%:
	RELEASE_CHANNEL=$(RELEASE_CHANNEL) \
        ENTRY_POINT=$(SRC_DIR)/$*/registry.css \
        OUTPUT_FILE=$(DIST_DIR)/$*/$*.css \
        $(NODE_BIN) $(CURDIR)/tools/run_postcss.js
