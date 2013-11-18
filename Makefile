ZIP     = zip
OPTION  = -6
# IGNORE  = -x .DS_Store
PACKAGE = linkplaces.xpi
FILE    = \
  ./content/linkplaces-browser.js \
  ./content/linkplaces-browser.xul \
  ./content/linkplaces-multipletab.js \
  ./content/linkplaces-multipletab.xul \
  ./content/linkplaces-options.xul \
  ./content/linkplaces-panel.js \
  ./content/linkplaces-panel.xul \
  ./content/linkplaces-places.js \
  ./content/linkplaces-places.xul \
  ./locale/en-US/linkplaces.dtd \
  ./skin/classic/Darwin/linkplaces-sidebar.css \
  ./skin/classic/Darwin/button-toolbar-active.png \
  ./skin/classic/Darwin/button-toolbar-active@2x.png \
  ./skin/classic/Darwin/button-toolbar.png \
  ./skin/classic/Darwin/button-toolbar@2x.png \
  ./skin/classic/Darwin/button-panel.png \
  ./skin/classic/Darwin/button-panel@2x.png \
  ./skin/classic/Darwin/linkplaces.css \
  ./skin/classic/Linux/linkplaces-sidebar.css \
  ./skin/classic/Linux/button-toolbar-large.png \
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
  ./modules/LinkplacesService.jsm \
  ./modules/LinkplacesPanel.jsm \
  ./defaults/preferences/linkplaces-prefs.js \
  chrome.manifest \
  install.rdf \
  icon.png


all: clean xpi

xpi: $(FILES)
	$(ZIP) $(OPTION) $(PACKAGE) $(FILE)

clean:
	-rm -rf $(PACKAGE)
