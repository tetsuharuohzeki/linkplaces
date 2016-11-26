PACKAGE := linkplaces.xpi

.PHONY: lint

all: xpi

xpi: clean_xpi lint
	npm run jpm -- xpi

clean: clean_xpi

clean_xpi:
	-rm -rf $(PACKAGE)

lint:
	npm test
