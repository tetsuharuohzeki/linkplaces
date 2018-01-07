PACKAGE := $(CURDIR)/linkplaces.xpi
NODE_MOD := $(CURDIR)/node_modules
NPM_BIN := $(NODE_MOD)/.bin

# Sorry. These are depends on *nix way...
export GIT_REVISION := $(shell git rev-parse --verify HEAD)
export BUILD_DATE := $(shell date '+%Y/%m/%d %H:%M:%S %z')

.PHONY: lint

all: help

help:
	@echo "Specify the task"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@exit 1


## clean
clean: clean_dist clean_obj clean_webext_artifacts

clean_dist:
	$(NPM_BIN)/del $(CURDIR)/__dist --force

clean_obj:
	$(NPM_BIN)/del $(CURDIR)/__obj --force

clean_webext_artifacts:
	$(NPM_BIN)/del $(CURDIR)/web-ext-artifacts


# build
build:
	$(MAKE) __webext_xpi -C $(CURDIR)

__webext_xpi: clean_webext_artifacts \
     lint \
     webextension
	$(NPM_BIN)/web-ext build -s $(CURDIR)/__dist

icon.png: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

webextension: webextension_cp webextension_bundle

webextension_cp: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/**/**.{json,html,css,svg}' $(CURDIR)/__dist --preserve
webextension_bundle: webextension_bundle_background webextension_bundle_popup webextension_bundle_sidebar webextension_bundle_options
webextension_bundle_background: clean_dist __obj
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/background/index.js --config $(CURDIR)/rollup.config.js --output.file $(CURDIR)/__dist/background/bundled.js --output.format iife

webextension_bundle_popup: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/popup/index.js --config $(CURDIR)/rollup.config.js --output.file $(CURDIR)/__dist/popup/bundled.js --output.format iife
webextension_bundle_sidebar: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/sidebar/index.js --config $(CURDIR)/rollup.config.js --output.file $(CURDIR)/__dist/sidebar/bundled.js --output.format iife
webextension_bundle_options: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/options/index.js --config $(CURDIR)/rollup.config.js --output.file $(CURDIR)/__dist/options/bundled.js --output.format iife

__external_dependency: \
	__external_dependency_react \
	__external_dependency_react_dom \
	__external_dependency_prop_types \
	__external_dependency_redux \
	__external_dependency_redux_thunk \
	__external_dependency_rxjs

__external_dependency_react: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react/umd/react.production.min.js' $(CURDIR)/__dist/third_party --preserve
__external_dependency_react_dom: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react-dom/umd/react-dom.production.min.js' $(CURDIR)/__dist/third_party --preserve
__external_dependency_prop_types: clean_dist
		$(NPM_BIN)/cpx '$(CURDIR)/node_modules/prop-types/prop-types.min.js' $(CURDIR)/__dist/third_party --preserve
__external_dependency_redux: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/redux/dist/redux.js' $(CURDIR)/__dist/third_party --preserve
__external_dependency_redux_thunk: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/redux-thunk/dist/redux-thunk.js' $(CURDIR)/__dist/third_party --preserve
__external_dependency_rxjs: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/rxjs/bundles/Rx.min.js' $(CURDIR)/__dist/third_party --preserve

__obj: clean_obj
	$(NPM_BIN)/tsc -p $(CURDIR)/tsconfig.json --outDir $(CURDIR)/__obj/src/

# Test
test: lint

lint: eslint tslint stylelint tscheck

eslint:
	$(NODE_MOD)/eslint/bin/eslint.js --ext=js,jsm src/ $(CURDIR)

tslint:
	$(NPM_BIN)/tslint --config $(CURDIR)/tslint.json '$(CURDIR)/src/**/*.ts{,x}'

tscheck:
	$(NPM_BIN)/tsc -p $(CURDIR)/tsconfig.json --noEmit

stylelint:
	$(NPM_BIN)/stylelint '$(CURDIR)/src/**/*.css' \
		--config=$(CURDIR)/stylelint.config.js \
		-f verbose \
		--color
