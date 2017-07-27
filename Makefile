PACKAGE := linkplaces.xpi
NODE_MOD := $(CURDIR)/node_modules
NPM_BIN := $(NODE_MOD)/.bin

.PHONY: lint

all: xpi

## clean
clean: clean_xpi clean_dist clean_obj

clean_dist:
	$(NPM_BIN)/del $(CURDIR)/__dist --force

clean_obj:
	$(NPM_BIN)/del $(CURDIR)/__obj --force

clean_xpi:
	$(NPM_BIN)/del $(PACKAGE)

# build
xpi: clean_xpi \
     lint \
     chrome.manifest \
     content \
     icon.png \
     locale \
     main.js \
     package.json \
     skin \
     webextension
	$(NPM_BIN)/jpm xpi --dest-dir=$(CURDIR) --addon-dir=$(CURDIR)/__dist

chrome.manifest: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/src/$@ $(CURDIR)/__dist --preserve

content: content_cp content_js

content_js: clean_dist __obj __dist/content/sidebar

__dist/content/sidebar: clean_dist __obj
	$(NPM_BIN)/cpx '$(CURDIR)/__obj/src/content/sidebar/*.js' $(CURDIR)/__dist/content/sidebar --preserve

content_cp: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/content/**/*.xul' $(CURDIR)/__dist/content --preserve

icon.png: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

locale: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

main.js: clean_dist __obj
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/$@ --config $(CURDIR)/rollup.config.jsm.js --output $(CURDIR)/__dist/$@

package.json: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

skin: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

webextension: webextension_cp webextension_icon webextension_bundle

webextension_cp: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/webextension/**/**.{json,html,css,svg}' $(CURDIR)/__dist/webextension --preserve
webextension_icon: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/skin/classic/toolbaricon.svg' $(CURDIR)/__dist/webextension --preserve
webextension_bundle: webextension_bundle_background webextension_bundle_popup webextension_bundle_sidebar webextension_bundle_options
webextension_bundle_background: clean_dist __obj
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/background/index.js --config $(CURDIR)/rollup.config.js --output $(CURDIR)/__dist/webextension/background/bundled.js

webextension_bundle_popup: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/popup/index.js --config $(CURDIR)/rollup.config.js --output $(CURDIR)/__dist/webextension/popup/bundled.js
webextension_bundle_sidebar: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/sidebar/index.js --config $(CURDIR)/rollup.config.js --output $(CURDIR)/__dist/webextension/sidebar/bundled.js
webextension_bundle_options: clean_dist __obj __external_dependency
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/options/index.js --config $(CURDIR)/rollup.config.js --output $(CURDIR)/__dist/webextension/options/bundled.js

__external_dependency: \
	__external_dependency_react \
	__external_dependency_react_dom \
	__external_dependency_prop_types \
	__external_dependency_redux \
	__external_dependency_redux_thunk \
	__external_dependency_rxjs

__external_dependency_react: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react/dist/react.min.js' $(CURDIR)/__dist/webextension/third_party --preserve
__external_dependency_react_dom: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react-dom/dist/react-dom.min.js' $(CURDIR)/__dist/webextension/third_party --preserve
__external_dependency_prop_types: clean_dist
		$(NPM_BIN)/cpx '$(CURDIR)/node_modules/prop-types/prop-types.min.js' $(CURDIR)/__dist/webextension/third_party --preserve
__external_dependency_redux: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/redux/dist/redux.js' $(CURDIR)/__dist/webextension/third_party --preserve
__external_dependency_redux_thunk: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/redux-thunk/dist/redux-thunk.js' $(CURDIR)/__dist/webextension/third_party --preserve
__external_dependency_rxjs: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/rxjs/bundles/Rx.min.js' $(CURDIR)/__dist/webextension/third_party --preserve

__obj: clean_obj
	$(NPM_BIN)/tsc -p ./tsconfig.json --outDir $(CURDIR)/__obj/src/

# Test
test: lint tscheck

lint: eslint tslint stylelint

eslint:
	$(NPM_BIN)/eslint --ext=js,jsm src/ $(CURDIR)

tslint:
	$(NPM_BIN)/tslint --config $(CURDIR)/tslint.json '$(CURDIR)/src/**/*.ts{,x}'

tscheck:
	$(NPM_BIN)/tsc -p ./tsconfig.json --noEmit

stylelint:
	$(NPM_BIN)/stylelint '$(CURDIR)/src/webextension/**/*.css' \
		--config=$(CURDIR)/stylelint.config.js \
		-f verbose \
		--color
