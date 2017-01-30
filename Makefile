PACKAGE := linkplaces.xpi
NPM_BIN := ./node_modules/.bin

.PHONY: lint

all: xpi

## clean
clean: clean_xpi clean_dist

clean_dist:
	$(NPM_BIN)/del $(CURDIR)/__dist --force

clean_xpi:
	-$(NPM_BIN)/del $(PACKAGE)

# build
xpi: clean_xpi \
     lint \
     flowcheck \
     chrome.manifest \
     content/ \
     icon.png \
     locale/ \
     main.js \
     package.json \
     skin/ \
     webextension/
	npm run jpm -- xpi --dest-dir=$(CURDIR) --addon-dir=$(CURDIR)/__dist

chrome.manifest: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/src/$@ $(CURDIR)/__dist --preserve

content/: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

icon.png: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

locale/: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

main.js: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/src/$@ $(CURDIR)/__dist --preserve

package.json: clean_dist
	$(NPM_BIN)/cpx $(CURDIR)/$@ $(CURDIR)/__dist --preserve

skin/: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*' $(CURDIR)/__dist/$@ --preserve

webextension/: clean_dist
	$(NPM_BIN)/cpx '$(CURDIR)/src/$@/**/*.{js,json}' $(CURDIR)/__dist/$@ --preserve

# Test
lint:
	npm test

flowcheck:
	$(NPM_BIN)/flow check
