NPM_MOD_DIR := $(CURDIR)/node_modules
NPM_BIN := $(NPM_MOD_DIR)/.bin

SRC_DIR := $(CURDIR)/src
OBJ_DIR := $(CURDIR)/__obj
OBJ_SRC_DIR := $(OBJ_DIR)/src
DIST_DIR := $(CURDIR)/__dist
ARTIFACT_DIR := $(CURDIR)/web-ext-artifacts

# Sorry. These are depends on *nix way...
export GIT_REVISION := $(shell git rev-parse --verify HEAD)
export BUILD_DATE := $(shell date '+%Y/%m/%d %H:%M:%S %z')

.PHONY: lint

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1


# clean
clean: clean_dist clean_obj clean_webext_artifacts ## Clean up all generated files.

clean_dist:
	$(NPM_BIN)/del $(DIST_DIR) --force

clean_obj:
	$(NPM_BIN)/del $(OBJ_DIR) --force

clean_webext_artifacts:
	$(NPM_BIN)/del $(ARTIFACT_DIR)


# build
build: ## Build the artifact.
	$(MAKE) __webext_xpi -C $(CURDIR)

__webext_xpi: clean_webext_artifacts \
     lint \
     webextension
	$(NPM_BIN)/web-ext build -s $(DIST_DIR)

icon.png: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(DIST_DIR) --preserve

webextension: webextension_cp webextension_bundle

webextension_cp: clean_dist
	$(NPM_BIN)/cpx '$(SRC_DIR)/**/**.{json,html,css,svg}' $(DIST_DIR) --preserve
webextension_bundle: webextension_bundle_background webextension_bundle_popup webextension_bundle_sidebar webextension_bundle_options
webextension_bundle_background: clean_dist __obj
	$(NPM_BIN)/rollup $(OBJ_SRC_DIR)/background/index.js --config $(CURDIR)/rollup.config.js --output.file $(DIST_DIR)/background/bundled.js

webextension_bundle_popup: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(OBJ_SRC_DIR)/popup/index.js --config $(CURDIR)/rollup.config.js --output.file $(DIST_DIR)/popup/bundled.js
webextension_bundle_sidebar: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(OBJ_SRC_DIR)/sidebar/index.js --config $(CURDIR)/rollup.config.js --output.file $(DIST_DIR)/sidebar/bundled.js
webextension_bundle_options: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(OBJ_SRC_DIR)/options/index.js --config $(CURDIR)/rollup.config.js --output.file $(DIST_DIR)/options/bundled.js

__external_dependency: \
	__external_dependency_react \
	__external_dependency_react_dom \
	__external_dependency_prop_types \
	__external_dependency_redux_thunk \
	__external_dependency_rxjs

__external_dependency_react: clean_dist
	$(NPM_BIN)/cpx '$(NPM_MOD_DIR)/react/umd/react.production.min.js' $(DIST_DIR)/third_party --preserve
__external_dependency_react_dom: clean_dist
	$(NPM_BIN)/cpx '$(NPM_MOD_DIR)/react-dom/umd/react-dom.production.min.js' $(DIST_DIR)/third_party --preserve
__external_dependency_prop_types: clean_dist
		$(NPM_BIN)/cpx '$(NPM_MOD_DIR)/prop-types/prop-types.min.js' $(DIST_DIR)/third_party --preserve
__external_dependency_redux_thunk: clean_dist
#	$(NPM_BIN)/cpx '$(NPM_MOD_DIR)/redux-thunk/dist/redux-thunk.js' $(DIST_DIR)/third_party --preserve
__external_dependency_rxjs: clean_dist
	$(NPM_BIN)/cpx '$(NPM_MOD_DIR)/rxjs/bundles/rxjs.umd.min.js' $(DIST_DIR)/third_party --preserve

__obj: __obj_ts __obj_js

__obj_js: clean_obj
	$(NPM_BIN)/cpx '$(SRC_DIR)/**/*.{js,jsx}' $(OBJ_SRC_DIR) --preserve

__obj_ts: clean_obj
	$(NPM_BIN)/tsc -p $(CURDIR)/tsconfig.json --outDir $(OBJ_SRC_DIR)


# Test
test: lint ava

lint: eslint tslint stylelint tscheck

eslint:
	$(NPM_BIN)/eslint --ext=js,jsx,mjs $(CURDIR)

tslint:
	$(NPM_BIN)/tslint --config $(CURDIR)/tslint.json '$(SRC_DIR)/**/*.ts{,x}'

tscheck:
	$(NPM_BIN)/tsc -p $(CURDIR)/tsconfig.json --noEmit --allowJs

stylelint:
	$(NPM_BIN)/stylelint '$(SRC_DIR)/**/*.css' \
		--config=$(CURDIR)/stylelint.config.js \
		-f verbose \
		--color

ava: __obj
	$(MAKE) run_ava

run_ava:
	$(NPM_BIN)/ava test/

git_diff: ## Test whether there is no committed changes.
	git diff --exit-code


# CI
ci: test git_diff


# Tools
fmt: fmt_css ## Apply formetters for files.

fmt_css:
	$(NPM_BIN)/prettier --single-quote --write '$(SRC_DIR)/**/*.css'
