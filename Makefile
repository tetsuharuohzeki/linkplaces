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
     flowcheck \
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

content_js: clean_dist __obj
	$(NPM_BIN)/babel '$(CURDIR)/__obj/src/content' --out-dir '$(CURDIR)/__dist/content' --extensions=.js

content_cp: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/content/**/*.xul' $(CURDIR)/__dist/content --preserve

icon.png: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

locale: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

main.js: clean_dist __obj
	$(NPM_BIN)/cpx $(CURDIR)/__obj/src/$@ $(CURDIR)/__dist --preserve

package.json: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

skin: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

webextension: webextension_cp webextension_icon webextension_bundle

webextension_cp: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/webextension/**/**.{json,html}' $(CURDIR)/__dist/webextension --preserve
webextension_icon: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/skin/classic/toolbaricon.svg' $(CURDIR)/__dist/webextension --preserve
webextension_bundle: webextension_bundle_background webextension_bundle_popup
webextension_bundle_background: clean_dist __obj
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/background/index.js --format iife --output $(CURDIR)/__dist/webextension/bundled_background.js

webextension_bundle_popup: clean_dist __obj __webextension_bundle_popup_dependencies_react __webextension_bundle_popup_dependencies_react_dom
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/webextension/popup/index.js --config $(CURDIR)/rollup.config.js --output $(CURDIR)/__dist/webextension//popup/bundled.js
__webextension_bundle_popup_dependencies_react: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react/umd/react.production.min.js' $(CURDIR)/__dist/webextension/third_party --preserve
__webextension_bundle_popup_dependencies_react_dom: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/node_modules/react-dom/umd/react-dom.production.min.js' $(CURDIR)/__dist/webextension/third_party --preserve

__obj: clean_obj
	$(NPM_BIN)/cpx '$(CURDIR)/src/**/*.js' $(CURDIR)/__obj/src/ --preserve

# Test
test: lint flowcheck tscheck

lint:
	$(NPM_BIN)/eslint --ext=js,jsm src/ $(CURDIR)

flowcheck:
	$(NPM_BIN)/flow check

tscheck:
	$(NPM_BIN)/tsc -p ./tsconfig.json --noEmit --allowJs
