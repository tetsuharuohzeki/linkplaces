ZIP     = zip
OPTION  = -6
# IGNORE  = -x .DS_Store
PACKAGE = linkplaces.xpi
FILE    = \
  ./content/linkplaces-browser.js \
  ./content/linkplaces-browser.xul \
  ./content/linkplaces-options.xul \
  ./content/LinkplacesChrome.js \
  ./content/LinkplacesService.js \
  ./content/LinkplacesUIWidget.js \
  ./content/service/ChromeDocObserver.js \
  ./content/service/pref.js \
  ./content/sidebar/linkplaces-panel.js \
  ./content/sidebar/linkplaces-panel.xul \
  ./content/sidebar/LinkplacesPanel.js \
  ./content/ui/contextmenu.js \
  ./content/ui/LinkplacesChromeCtxMenu.js \
  ./content/ui/LinkPlacesChromePanel.js \
  ./content/ui/LinkplacesChromePlaces.js \
  ./content/ui/LinkplacesChromeSidebar.js \
  ./locale/en-US/linkplaces.dtd \
  ./locale/en-US/linkplaces.properties \
  ./skin/classic/Darwin/linkplaces-sidebar.css \
  ./skin/classic/Darwin/button-toolbar.png \
  ./skin/classic/Darwin/button-toolbar@2x.png \
  ./skin/classic/Darwin/button-panel.png \
  ./skin/classic/Darwin/button-panel@2x.png \
  ./skin/classic/Darwin/linkplaces.css \
  ./skin/classic/Linux/linkplaces-sidebar.css \
  ./skin/classic/Linux/button-toolbar.png \
  ./skin/classic/Linux/button-panel.png \
  ./skin/classic/Linux/button-panel@2x.png \
  ./skin/classic/Linux/linkplaces.css \
  ./skin/classic/WINNT/linkplaces-sidebar.css \
  ./skin/classic/WINNT/button-toolbar-inverted.png \
  ./skin/classic/WINNT/button-toolbar.png \
  ./skin/classic/WINNT/button-toolbar@2x.png \
  ./skin/classic/WINNT/button-panel.png \
  ./skin/classic/WINNT/button-panel@2x.png \
  ./skin/classic/WINNT/linkplaces.css \
  ./defaults/preferences/linkplaces-prefs.js \
  chrome.manifest \
  install.rdf \
  icon.png

.PHONY: lint

all: clean lint xpi

xpi: $(FILES) lint
	$(ZIP) $(OPTION) $(PACKAGE) $(FILE)

clean:
	-rm -rf $(PACKAGE)

lint:
	npm test
