NODE_BIN := node
NPM_MOD_DIR := $(CURDIR)/node_modules
NPM_BIN := $(NPM_MOD_DIR)/.bin

REPOSITORY_ROOT_DIR := $(CURDIR)/../..

SRC_DIR := $(CURDIR)/src
PLAIN_DIR := $(CURDIR)/__plain
PLAIN_SRC_DIR := $(PLAIN_DIR)/src
OBJ_DIR := $(CURDIR)/__obj
OBJ_SRC_DIR := $(OBJ_DIR)/src
DIST_DIR := $(CURDIR)/__dist

ESLINT_TARGET_EXTENSION := js,jsx,cjs,mjs,ts,tsx
PRETTIER_TARGET := '$(SRC_DIR)/**/*.css'

USE_ESBUILD ?= 0

export RELEASE_CHANNEL ?= production

# ifeq ($(RELEASE_CHANNEL),production)
# endif

# Sorry. These are depends on *nix way...
export GIT_REVISION := $(shell git rev-parse --verify HEAD)
export BUILD_DATE := $(shell date '+%Y/%m/%d %H:%M:%S %z')

.PHONY: lint

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
clean: clean_compiler_info clean_dist clean_obj clean_plain clean_webext_artifacts ## Clean up all generated files.

clean_compiler_info:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(CURDIR)/tsconfig.tsbuildinfo --force

clean_dist:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(DIST_DIR) --force

clean_obj:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(OBJ_DIR) --force

clean_plain:
	$(NODE_BIN) $(CURDIR)/tools/rm_dir.js $(PLAIN_DIR) --force

clean_webext_artifacts:
	$(MAKE) $@ -C $(REPOSITORY_ROOT_DIR)


####################################
# Build
####################################
.PHONY: build_development
build_development: ## Run `make build` with `RELEASE_CHANNEL=development`
	$(MAKE) build RELEASE_CHANNEL=development

.PHONY: build_production
build_production: ## Run `make build` with `RELEASE_CHANNEL=production`
	$(MAKE) build RELEASE_CHANNEL=production

.PHONY: build
build: lint build_package ## Build the artifact and run all lint (This is not for CI).

.PHONY: build_package
build_package: __webext_xpi ## Build the artifact.

__webext_xpi: clean_webext_artifacts webextension
	$(MAKE) $@ -C $(REPOSITORY_ROOT_DIR)

webextension: webextension_cp webextension_js webextension_css

webextension_cp: clean_dist
	$(NODE_BIN) $(CURDIR)/tools/cp_files.js --basedir $(SRC_DIR) --source '$(SRC_DIR)/**/**.{json,html,svg}' --destination $(DIST_DIR) --verbose

ifeq ($(USE_ESBUILD),1)
webextension_js: $(addprefix __bundle_js_esbuild_, background popup sidebar options)
else
webextension_js: $(addprefix __bundle_js_, background popup sidebar options)
endif

webextension_css: $(addprefix __bundle_css_, popup sidebar options)

__bundle_js_esbuild_%: clean_dist __obj __external_dependency
	RELEASE_CHANNEL=$(RELEASE_CHANNEL) \
	ENTRY_POINT=$(OBJ_SRC_DIR)/$*/index.js \
	OUTPUT_FILE=$(DIST_DIR)/$*/$*_bundled.js \
        $(NODE_BIN) $(CURDIR)/tools/run_esbuild.js

__bundle_js_%: clean_dist __obj __external_dependency
	RELEASE_CHANNEL=$(RELEASE_CHANNEL) $(NPM_BIN)/rollup $(OBJ_SRC_DIR)/$*/index.js --config $(CURDIR)/rollup.config.mjs --output.file $(DIST_DIR)/$*/$*_bundled.js

__bundle_css_%: clean_dist
	RELEASE_CHANNEL=$(RELEASE_CHANNEL) \
        ENTRY_POINT=$(SRC_DIR)/$*/registry.css \
        OUTPUT_FILE=$(DIST_DIR)/$*/$*.css \
        $(NODE_BIN) $(CURDIR)/tools/run_postcss.js

__external_dependency:

__obj: __plain clean_obj
	$(NPM_BIN)/babel $(PLAIN_DIR) --out-dir $(OBJ_DIR) --extensions=.js,.jsx --config-file $(CURDIR)/babel.config.mjs

__plain: $(addprefix __plain_, ts js)

__plain_js: clean_plain
	$(NODE_BIN) $(CURDIR)/tools/cp_files.js --basedir $(SRC_DIR) --source '$(SRC_DIR)/**/*.{js,jsx}' --destination $(PLAIN_SRC_DIR) --verbose

__plain_ts: clean_plain
	$(MAKE) $@ -C $(REPOSITORY_ROOT_DIR)


####################################
# Test
####################################
test: lint unittest ## Run all tests command (This is not for CI).

lint: eslint stylelint

eslint: ## Run ESLint
	$(NPM_BIN)/eslint --ext=$(ESLINT_TARGET_EXTENSION) $(CURDIR)

eslint_fix: ## Run ESLint with --fix option
	$(NPM_BIN)/eslint --ext=$(ESLINT_TARGET_EXTENSION) $(CURDIR) --fix

stylelint: ## Run stylelint
	$(NPM_BIN)/stylelint '$(SRC_DIR)/**/*.css' \
		--config=$(CURDIR)/stylelint.config.cjs \
		-f verbose \
		--color

unittest: __obj ## Run unit tests
	$(MAKE) run_ava

run_ava: ## Only run unit tests
	$(NPM_BIN)/ava --config $(CURDIR)/ava.config.cjs

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code


####################################
# Tools
####################################
format: format_css format_js ## Apply formetters for files.

format_css:
	$(NPM_BIN)/prettier --write $(PRETTIER_TARGET)

format_js:
	$(NPM_BIN)/eslint --ext=$(ESLINT_TARGET_EXTENSION) $(CURDIR) --fix

check_format: check_format_css

check_format_css:
	$(NPM_BIN)/prettier --check $(PRETTIER_TARGET)
