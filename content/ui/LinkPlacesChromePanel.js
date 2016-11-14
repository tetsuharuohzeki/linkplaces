/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */

"use strict";

const { SIDEBAR_BROADCAST_ID, SHORTCUT_ID, } = require("./LinkplacesChromeSidebar");

const PANEL_UI_ID = "PanelUI-linkplaces";

class LinkPlacesChromePanel {

  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._mountpoint = null;
    this._dom = null;

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._dom = null;
    this._mountpoint = null;
    this._service = null;
    this._win = null;
  }

  _init() {
    const document = this._win.document;
    this._dom = createDOM(document, this._service);

    this._mountpoint = document.querySelector("panelmultiview#PanelUI-multiView");
    if (this._mountpoint === null) {
      throw new TypeError();
    }
    this._mountpoint.appendChild(this._dom);
  }

  _finalize() {
    this._mountpoint.removeChild(this._dom);
  }

  onPanelMenuViewCommand(aEvent, aView) {
    const window = this._win;
    const target = aEvent.originalTarget;
    const placesNode = target._placesNode; // eslint-disable-line no-underscore-dangle
    if (!placesNode) {
      return;
    }

    if (window.PlacesUtils.nodeIsContainer(placesNode)) {
      window.PlacesCommandHook.showPlacesOrganizer([ "BookmarksMenu", placesNode.itemId ]);
    }
    else {
      const node = placesNode;
      const where = this.whereToOpenLink(aEvent, node.uri);
      window.PlacesUIUtils.openNodeIn(node, where, aView);
      this._service.removeItem(node.itemId);
    }
    window.PanelUI.hide();
  }

  whereToOpenLink(aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) { // eslint-disable-line no-script-url
      // for bookmarklet
      rv = "current";
    }
    else {
      const window = this._win;
      const where = window.whereToOpenLink(aEvent);
      switch (where) {
        case "current":
          rv = this._service.config().openLinkTo();
          break;
        default:
          rv = where;
          break;
      }
    }
    return rv;
  }
}

module.exports = Object.freeze({
  LinkPlacesChromePanel,
  createDOM,
  PANEL_UI_ID,
});

/**
  <!--
    Import from browser/components/customizableui/content/panelUI.inc.xul.
    Original codes are `#PanelUI-bookmarks` & `#PanelUI-history`.
  -->
  <panelmultiview id="PanelUI-multiView" mainViewId="PanelUI-mainView">
    <panelview id="PanelUI-linkplaces" flex="1" class="PanelUI-subView">
      <label value="&linkplaces.global;" class="panel-subview-header"/>
      <vbox class="panel-subview-body">
        <toolbarbutton id="panelMenu_viewLinkplacesSidebar"
                       label="&linkplaces.widget.menuitem.toggleSidebar;"
                       class="subviewbutton"
                       key="linkplaces-key-toggleSidebar"
                       oncommand="SidebarUI.toggle('viewLinkplacesSidebar'); PanelUI.hide();">
          <observes element="viewLinkplacesSidebar" attribute="checked"/>
        </toolbarbutton>
        <toolbarseparator/>
        <toolbaritem id="panelMenu_linkplacesMenu"
                     orient="vertical"
                     smoothscroll="false"
                     onclick="if (event.button == 1) { gLinkplacesBrowserUI.panel().onPanelMenuViewCommand(event, this._placesView); }"
                     oncommand="gLinkplacesBrowserUI.panel().onPanelMenuViewCommand(event, this._placesView);"
                     flatList="true"
                     tooltip="bhTooltip">
          <!-- bookmarks menu items will go here -->
        </toolbaritem>
      </vbox>
    </panelview>
  </panelmultiview>
 */

function createDOM(document, service) {
  const stringBundle = service.stringBundle;

  const panelview = document.createElement("panelview");
  panelview.setAttribute("id", PANEL_UI_ID);
  panelview.setAttribute("flex", "1");
  panelview.setAttribute("class", "PanelUI-subView");

  const label = document.createElement("label");
  label.setAttribute("value", stringBundle.GetStringFromName("linkplaces.widget.panel.title")); // eslint-disable-line new-cap
  label.setAttribute("class", "panel-subview-header");

  const vbox = document.createElement("vbox");
  vbox.setAttribute("class", "panel-subview-body");

  const toolbarbutton = document.createElement("toolbarbutton");
  toolbarbutton.setAttribute("id", "panelMenu_viewLinkplacesSidebar");
  toolbarbutton.setAttribute("label", stringBundle.GetStringFromName("linkplaces.widget.panel.toggleSidebar")); // eslint-disable-line new-cap
  toolbarbutton.setAttribute("class", "subviewbutton");
  toolbarbutton.setAttribute("key", SHORTCUT_ID);
  toolbarbutton.setAttribute("oncommand", `SidebarUI.toggle("${SIDEBAR_BROADCAST_ID}"); PanelUI.hide();`);

  const observes = document.createElement("observes");
  observes.setAttribute("element", SIDEBAR_BROADCAST_ID);
  observes.setAttribute("attribute", "checked");

  const toolbarseparator = document.createElement("toolbarseparator");

  const toolbaritem = document.createElement("toolbaritem");
  toolbaritem.setAttribute("id", "panelMenu_linkplacesMenu");
  toolbaritem.setAttribute("orient", "vertical");
  toolbaritem.setAttribute("smoothscroll", "false");
  toolbaritem.setAttribute("onclick", "if (event.button == 1) { gLinkplacesBrowserUI.panel().onPanelMenuViewCommand(event, this._placesView); }");
  toolbaritem.setAttribute("oncommand", "gLinkplacesBrowserUI.panel().onPanelMenuViewCommand(event, this._placesView);");
  toolbaritem.setAttribute("flatList", "true");
  toolbaritem.setAttribute("tooltip", "bhTooltip");

  panelview.appendChild(label);
  panelview.appendChild(vbox);
  vbox.appendChild(toolbarbutton);
  toolbarbutton.appendChild(observes);
  vbox.appendChild(toolbarseparator);
  vbox.appendChild(toolbaritem);

  return panelview;
}
