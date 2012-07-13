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
  ./skin/classic/Darwin/linkplaces-toolbar-active.png \
  ./skin/classic/Darwin/linkplaces-toolbar.png \
  ./skin/classic/Darwin/linkplaces.css \
  ./skin/classic/Linux/linkplaces-sidebar.css \
  ./skin/classic/Linux/linkplaces-toolbar-large.png \
  ./skin/classic/Linux/linkplaces-toolbar.png \
  ./skin/classic/Linux/linkplaces.css \
  ./skin/classic/WINNT/linkplaces-sidebar.css \
  ./skin/classic/WINNT/linkplaces-toolbar-inverted.png \
  ./skin/classic/WINNT/linkplaces-toolbar.png \
  ./skin/classic/WINNT/linkplaces.css \
  ./modules/linkplaces.js \
  ./defaults/preferences/linkplaces-prefs.js \
  chrome.manifest \
  install.rdf \
  icon.png


all:  $(PACKAGE)

$(PACKAGE):  $(FILES)
	$(ZIP) $(OPTION) $(PACKAGE) $(FILE)
