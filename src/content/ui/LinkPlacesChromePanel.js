/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* @flow */

import { SIDEBAR_BROADCAST_ID, SHORTCUT_ID, } from "./LinkplacesChromeSidebar";

/*::
  import type { LinkplacesService } from "../LinkplacesService";
*/

export const PANEL_UI_ID = "PanelUI-linkplaces";

export class LinkPlacesChromePanel {


  /*::
    _win: window;
    _service: LinkplacesService;
    _dom: Element | null;
  */

  constructor(win /* :window */, service /* :LinkplacesService */) {
    this._win = win;
    this._service = service;
    this._dom = null;

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    // XXX: release objects
    this._dom = (null /*:: :any*/);
    this._service = (null /*:: :any*/);
    this._win = (null /*:: :any*/);
  }

  _init() {
    const document = this._win.document;
    this._dom = createDOM(document, this._service);

    const mountpoint = document.querySelector("panelmultiview#PanelUI-multiView");
    if (mountpoint === null) {
      throw new TypeError();
    }
    mountpoint.appendChild(this._dom);
  }

  _finalize() {
    if (this._dom === null) {
      throw new TypeError("`this._dom` should not be null");
    }

    this._dom.remove();
  }

  onPanelMenuViewCommand(aEvent /* :any */, aView /*:any */) {
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
      const uri = node.uri;
      const where = this._service.whereToOpenLink(window.whereToOpenLink, aEvent, uri);
      const service = this._service;
      let result = null;
      if (window.PlacesUtils.nodeIsSeparator(node)) {
        result = Promise.resolve({ ok: true });
      }
      else {
        const { isPrivileged, type } = service.getLinkSchemeType(uri);
        if (isPrivileged && type !== "javascript") {
          window.PlacesUIUtils.openNodeIn(node, where, aView);
          result = Promise.resolve({ ok: true });
        }
        else {
          result = service.openTab(uri, where);
        }
      }
      result.then((result) => {
        if (result.ok) {
          service.removeItem(node.bookmarkGuid);
        }
        else {
          window.console.error(result.error);
        }
      }).catch(window.console.error);
    }
    window.PanelUI.hide();
  }
}

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
