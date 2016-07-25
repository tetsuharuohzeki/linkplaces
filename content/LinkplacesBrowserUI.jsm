/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const EXPORTED_SYMBOLS = ["LinkplacesBrowserUI"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const DOM_ID_TAB_CTX_SAVE_TAB = "linkplaces-tabCtx-saveTab";
const DOM_ID_CONTENT_CTX_SAVE_PAGE = "linkplaces-contentCtx-savePage";
const DOM_ID_CONTENT_CTX_SAVE_LINK = "linkplaces-contentCtx-saveLink";

const SIDEBAR_BROADCAST_ID = "viewLinkplacesSidebar";

class LinkplacesBrowserUI {

  /**
   *  @param  {ChromeWindow} win
   *  @param  {LinkplacesService} service
   */
  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._dom = {
      broadcaster: null,
      menubarpopup: null,
      keyset: null,
      panel: null,

      tabCtx: {
        saveTab: null,
      },

      contentCtx: {
        savePage: null,
        saveLink: null,
      },
    };

    this.init();
  }

  get service() {
    return this._service;
  }

  init() {
    this.createContentContextMenu();
    this.createTabContextMenu();

    this._dom.broadcaster = new Broadcaster(this._win);
    this._dom.menubarpopup = new MenubarItem(this._win);
    this._dom.keyset = new ShortcutKey(this._win);
    this._dom.panel = new Panel(this._win, this._service);

    this._win.addEventListener("unload", this, false);
    this._win.document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this, false);
  }

  finalize() {
    this._win.SidebarUI.hide(SIDEBAR_BROADCAST_ID);
    this._win.removeEventListener("unload", this, false);
    this._win.document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing", this, false);

    this._dom.keyset.finalize();
    this._dom.menubarpopup.finalize();
    this._dom.broadcaster.finalize();
    this._dom.tabCtx.saveTab.finalize();
    this._dom.contentCtx.savePage.finalize();
    this._dom.contentCtx.saveLink.finalize();
  }

  createContentContextMenu() {
    const savePage = new ContextMenuItem(this._win, {
      id: DOM_ID_CONTENT_CTX_SAVE_PAGE,
      label: "Add Page to LinkPlaces",  // FIXME: i18n
      onCommand: () => {
        this.saveThisPage();
      },
      mountpoint: "#context-savepage",
    });
    this._dom.contentCtx.savePage = savePage;

    const saveLink = new ContextMenuItem(this._win, {
      id: DOM_ID_CONTENT_CTX_SAVE_LINK,
      label: "Add Link to LinkPlaces",  // FIXME: i18n
      onCommand: () => {
        this.saveLink();
      },
      mountpoint: "#context-bookmarklink + menuitem",
    });
    this._dom.contentCtx.saveLink = saveLink;
  }

  createTabContextMenu() {
    this._dom.tabCtx.saveTab = new ContextMenuItem(this._win, {
      id: DOM_ID_TAB_CTX_SAVE_TAB,
      label: "Add Tab to LinkPlaces", // FIXME: i18n
      onCommand: () => {
        this.saveThisTab();
      },
      mountpoint: "#context_bookmarkAllTabs + menuitem"
    });
  }

  handleEvent(event) {
    switch (event.type) {
      case "popupshowing":
        if (event.target.id === "contentAreaContextMenu") {
          this.handleContentCtxPopup();
        }
        break;
      case "unload":
        this.finalize();
        break;
    }
  }

  handleContentCtxPopup() {
    const gContextMenu = this._win.gContextMenu;
    const contextCtx = this._dom.contentCtx;

    gContextMenu.showItem(contextCtx.savePage.dom(),
                          !(gContextMenu.isContentSelected || gContextMenu.onTextInput || gContextMenu.onLink ||
                            gContextMenu.onImage || gContextMenu.onVideo || gContextMenu.onAudio));
    gContextMenu.showItem(contextCtx.saveLink.dom(),
                          gContextMenu.onLink && !gContextMenu.onMailtoLink);
  }

  saveLink() {
    const gContextMenu = this._win.gContextMenu;
    this.service.saveItem(gContextMenu.linkURL, gContextMenu.linkTextStr);
  }

  saveThisPage() {
    const tab = this._win.gBrowser.selectedTab;
    this.saveTab(tab);
  }

  saveThisTab() {
    const tab = this._win.TabContextMenu.contextTab;
    this.saveTab(tab);
  }

  saveTab(tab) {
    const browser = tab.linkedBrowser;
    const uri = browser.currentURI.spec;
    const title = browser.contentTitle || uri;
    this.service.saveItem(uri, title);
  }
}

class ContextMenuItem {
  constructor(win, { id, label, onCommand, mountpoint, }) {
    const dom = win.document.createElement("menuitem");
    dom.setAttribute("id", id);
    dom.setAttribute("label", label);

    this._dom = dom;
    this._onCommand = onCommand;

    dom.addEventListener("command", this, false);

    const mp = win.document.querySelector(mountpoint);
    mp.parentNode.insertBefore(dom, mp);
  }

  handleEvent(event) {
    switch (event.type) {
      case "command":
        this._onCommand(event);
        break;
    }
  }

  finalize() {
    this._dom.parentNode.removeChild(this._dom)

    this._dom.removeEventListener("command", this, false);
    this._onCommand = null;
    this._dom = null;
  }

  dom() {
    return this._dom;
  }

  _onCommand(event) {
    this._onCommand();
  }
}

/*
class ToolbarButton {
  constructor(win, service) {
    this._win = win;
    this._service = service;

    const dom = win.document.createElement("toolbarbutton");
    dom.setAttribute("id", "linkplaces-button");
    dom.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
    dom.setAttribute("tooltiptext", "Display LinkPlaces Sidebar"); // FIXME: i18n
    dom.setAttribute("observes", "viewLinkplacesSidebar");
    this._dom = dom;

    win.document.getElementById("BrowserToolbarPalette").appendChild(dom);

    dom.addEventListener("drop", this, false);
    dom.addEventListener("dragover", this, false);
    dom.addEventListener("dragenter", this, false);
    dom.addEventListener("dragexit", this, false);
  }

  finalize() {
    this._dom.removeEventListener("dragexit", this, false);
    this._dom.removeEventListener("dragenter", this, false);
    this._dom.removeEventListener("dragover", this, false);
    this._dom.removeEventListener("drop", this, false);

    this._dom.parentNode.removeChild(this._dom);

    this._dom = null;
    this._service = null;
    this._win = null;
  }

  handleEvent(event) {
    switch (event.type) {
      case "drop":
        this.onDrop(event);
        break;
      case "dragover":
        this.onDragover(event);
        break;
      case "dragenter":
        this.onDragover(event);
        break;
      case "dragexit":
        break;
    }
  }

  onDrop(event) {
    const service = this._service;
    const ip = new this._win.InsertionPoint(service.folder,
                                            service.DEFAULT_INDEX,
                                            Ci.nsITreeView.DROP_ON);
    this._win.PlacesControllerDragHelper.onDrop(ip, event.dataTransfer);
  }

  onDragover(event) {
    this._win.browserDragAndDrop.dragOver(event);
    event.dropEffect = "link";
  }
}
*/

/**
 *
 * Import from browser/components/customizableui/content/panelUI.inc.xul.
 * Original codes are `#PanelUI-bookmarks` & `#PanelUI-history`.
 */
class Panel {
  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._dom = null;

    const document = this._win.document;
    const panelview = document.createElement("panelview");
    panelview.setAttribute("id", "PanelUI-linkplaces");
    panelview.setAttribute("flex", "1");
    panelview.setAttribute("class", "PanelUI-subView");

    const label = document.createElement("label");
    label.setAttribute("value", "LinkPlaces");// FIXME: i18n
    label.setAttribute("class", "panel-subview-header");
    panelview.appendChild(label);

    const vbox = document.createElement("vbox");
    vbox.setAttribute("class", "panel-subview-body");
    panelview.appendChild(vbox);

    const toggleButton = document.createElement("toolbarbutton");
    toggleButton.setAttribute("id", "panelMenu_viewLinkplacesSidebar");
    toggleButton.setAttribute("label", "View LinkPlaces Sidebar"); // FIXME: i18n
    toggleButton.setAttribute("class", "subviewbutton");
    toggleButton.setAttribute("key", "linkplaces-key-toggleSidebar");
    toggleButton.setAttribute("oncommand", "SidebarUI.toggle('" + SIDEBAR_BROADCAST_ID + "'); PanelUI.hide();");
    vbox.appendChild(toggleButton);
    const toggleObserves = document.createElement("observes");
    toggleObserves.setAttribute("element", SIDEBAR_BROADCAST_ID);
    toggleObserves.setAttribute("attribute", "checked");
    toggleButton.appendChild(toggleObserves);

    const seperator = document.createElement("toolbarseparator");
    vbox.appendChild(seperator);

    const menuContainer = document.createElement("toolbaritem");
    menuContainer.setAttribute("id", "panelMenu_linkplacesMenu");
    menuContainer.setAttribute("orient", "vertical");
    menuContainer.setAttribute("smoothscroll", "false");
    menuContainer.setAttribute("tooltip", "bhTooltip");
    menuContainer.setAttribute("flatList", "true");
    menuContainer.addEventListener("click", this, false);
    menuContainer.addEventListener("command", this, false);
    vbox.appendChild(menuContainer);

    document.getElementById("PanelUI-multiView").appendChild(panelview);
    this._dom = panelview;
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        this.onClick(event);
        break;
      case "command":
        this.onCommand(event);
        break;
    }
  }

  finalize() {
    const listened = this._dom.querySelector("#panelMenu_linkplacesMenu");
    listened.removeEventListener("click", this, false);
    listened.removeEventListener("command", this, false);

    this._dom = null;
    this._service = null;
    this._win = null;
  }

  onClick(event) {
    if (event.button === 1) {
      const current = event.currentTarget;
      this._onPanelMenuViewCommand(event, current._placesView);
    }
  }

  _onPanelMenuViewCommand(event, view) {
    const window = this._win;
    let target = event.originalTarget;
    if (!target._placesNode) {
      return;
    }
    if (window.PlacesUtils.nodeIsContainer(target._placesNode)) {
      window.PlacesCommandHook.showPlacesOrganizer([ "BookmarksMenu", target._placesNode.itemId ]);
    }
    else {
      let node = target._placesNode;
      let where = this.whereToOpenLink(event, node.uri);
      window.PlacesUIUtils.openNodeIn(node, where, view);
      this._service.removeItem(node.itemId);
    }
    window.PanelUI.hide();
  }

  whereToOpenLink(event, uri) {
    let rv = "";
    if (uri.startsWith("javascript:")) {
      // for bookmarklet
      rv = "current";
    }
    else {
      const window = this._win;
      let where = window.whereToOpenLink(event);
      switch (where) {
        case "current":
          rv = this._service.PREF.openLinkToWhere;
          break;
        default:
          rv = where;
          break;
      }
    }
    return rv;
  }

  onCommand(event) {
    const current = event.currentTarget;
    this._onPanelMenuViewCommand(event, current._placesView);
  }
}

class ShortcutKey {
  constructor(win) {
    this._win = win;

    const dom = win.document.createElement("key");
    dom.setAttribute("id", "linkplaces-key-toggleSidebar");
    dom.setAttribute("key", "L"); // FIXME: i18n
    dom.setAttribute("modifiers", "accel,alt");
    dom.setAttribute("command", SIDEBAR_BROADCAST_ID);

    this._dom = dom;
    win.document.getElementById("mainKeyset").appendChild(dom);
  }

  finalize() {
    this._dom.parentNode.removeChild(this._dom);
    this._dom = null;
    this._win = null;
  }
}

class MenubarItem {
  constructor(win) {
    this._win = win;

    const dom = win.document.createElement("menuitem");
    dom.setAttribute("id", "linkplaces-menu-sidebar");
    dom.setAttribute("key", "linkplaces-key-toggleSidebar");
    dom.setAttribute("observes", SIDEBAR_BROADCAST_ID);
    this._dom = dom;

    win.document.getElementById("viewSidebarMenu").appendChild(dom);
  }

  finalize() {
    this._dom.parentNode.removeChild(this._dom);
    this._dom = null;
    this._win = null;
  }
}

class Broadcaster {
  constructor(win) {
    this._win = win;

    const dom = win.document.createElement("broadcaster");
    dom.setAttribute("id", SIDEBAR_BROADCAST_ID);
    dom.setAttribute("label", "LinkPlaces (Sidebar)"); // FIXME: i18n
    dom.setAttribute("autoCheck", "false");
    dom.setAttribute("type", "checkbox");
    dom.setAttribute("group", "sidebar");
    dom.setAttribute("sidebartitle", "LinkPlaces"); // FIXME: i18n
    dom.setAttribute("sidebarurl", "chrome://linkplaces/content/linkplaces-panel.xul");
    // XXX: Does not work with `addEventListener()`
    dom.setAttribute("oncommand", "SidebarUI.toggle('"+ SIDEBAR_BROADCAST_ID + "')");
    this._dom = dom;

    win.document.getElementById("mainBroadcasterSet").appendChild(dom);
  }

  finalize() {
    this._dom.parentNode.removeChild(this._dom);
    this._dom = null;
    this._win = null;
  }
}
