PACKAGE := linkplaces.xpi

.PHONY: lint

all: clean lint xpi

xpi: lint
	npm run jpm -- xpi

clean:
	-rm -rf $(PACKAGE)

lint:
	npm test
