ZIP     = zip
PACKAGE := ../linkplaces.xpi
OPTION = -6
FILE    = \
  content/sidebar/linkplaces-sidebar.js \
  content/sidebar/linkplaces-sidebar.xul \
  content/sidebar/LinkplacesSidebarContent.js \
  webextension/background/bundled.js \
  webextension/background/bundled.js.map \
  webextension/options/bundled.js \
  webextension/options/bundled.js.map \
  webextension/options/index.html \
  webextension/popup/bundled.js \
  webextension/popup/bundled.js.map \
  webextension/popup/index.html \
  webextension/popup/popup.css \
  webextension/shared/image/icon/folder-16.svg \
  webextension/shared/image/icon/identity-not-secure.svg \
  webextension/shared/image/icon/sidebar-16.svg \
  webextension/sidebar/bundled.js \
  webextension/sidebar/bundled.js.map \
  webextension/sidebar/index.html \
  webextension/sidebar/sidebar.css \
  webextension/third_party/prop-types.min.js \
  webextension/third_party/react-dom.production.min.js \
  webextension/third_party/react.production.min.js \
  webextension/third_party/redux-thunk.js \
  webextension/third_party/redux.js \
  webextension/third_party/Rx.min.js \
  webextension/manifest.json \
  webextension/toolbaricon.svg \
  bootstrap.js \
	bootstrap.js.map \
  chrome.manifest \
  icon.png \
  install.rdf

xpi: $(FILES)
	$(ZIP) $(OPTION) '$(PACKAGE)' $(FILE)
