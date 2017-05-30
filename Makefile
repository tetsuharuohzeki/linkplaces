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

content: clean_dist __obj
	$(NPM_BIN)/cpx '$(CURDIR)/__obj/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

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

webextension: clean_dist __obj
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/**.json' $(CURDIR)/__dist/$@ --preserve
	$(NPM_BIN)/rollup $(CURDIR)/__obj/src/$@/background/index.js --format iife --output $(CURDIR)/__dist/$@/bundled_background.js

__obj: clean_obj
	$(NPM_BIN)/cpx '$(CURDIR)/src/**/*.js' $(CURDIR)/__obj/src/ --preserve

# Test
test: lint flowcheck

lint:
	$(NPM_BIN)/eslint --ext=js,jsm src/ $(CURDIR)

flowcheck:
	$(NPM_BIN)/flow check

tscheck:
	$(NPM_BIN)/tsc -p ./tsconfig.json --noEmit --allowJs
