/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

// Bootstrap Addon Reason Constants:
const APP_STARTUP     = 1;
const APP_SHUTDOWN    = 2;
const ADDON_ENABLE    = 3;
const ADDON_DISABLE   = 4;
const ADDON_INSTALL   = 5;
const ADDON_UNINSTALL = 6;
const ADDON_UPGRADE   = 7;
const ADDON_DOWNGRADE = 8;

Cu.import("resource://gre/modules/Services.jsm");

/** @type   {WeakMap<Window, linkplaces>} */
let gObjectMap = null;

let gWidgetData = null;

let sss = null;
let css = null;

let gChromeDocObserver = null;

/**
 * bootstrapped addon interfaces
 *
 * @param   {?}         aData
 * @param   {number}    aReason
 */
function startup(aData, aReason) {
  Cu.import("chrome://linkplaces/content/LinkplacesBrowserUI.jsm");
  Cu.import("chrome://linkplaces/content/LinkplacesService.jsm");
  Cu.import("chrome://linkplaces/content/LinkplacesUIWidget.jsm");

  createLinkplacesService();

  gObjectMap = new WeakMap();
  gWidgetData = createWidget(getLinkplacesService());


  sss = Cc["@mozilla.org/content/style-sheet-service;1"]
    .getService(Ci.nsIStyleSheetService);
  css = Services.io.newURI("chrome://linkplaces/skin/linkplaces.css", null, null);
  sss.loadAndRegisterSheet(css, sss.AGENT_SHEET);

  gChromeDocObserver = new ChromeDocObserver();

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    SetupHelper.setup(domWindow);
  }

  Services.wm.addListener(WindowListener);
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 */
function shutdown(aData, aReason) {
  Services.wm.removeListener(WindowListener);

  // if the application is shutdown time, we don't have to call these step.
  if (aReason === APP_SHUTDOWN) {
    return;
  }

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    SetupHelper.teardown(domWindow);
  }

  destroyWidget(gWidgetData.id);
  finalizeLinkPlacesService();

  gWidgetData = null;
  gObjectMap = null;
  gChromeDocObserver.finalize();
  gChromeDocObserver = null;

  if (sss.sheetRegistered(css, sss.AGENT_SHEET)) {
    sss.unregisterSheet(css, sss.AGENT_SHEET);
  }

  sss = null;
  css = null;

  //Cu.unload("chrome://linkplaces/content/LinkplacesUIWidget.jsm");
  //Cu.unload("chrome://linkplaces/content/LinkplacesService.jsm");
  //Cu.unload("chrome://linkplaces/content/LinkplacesBrowserUI.jsm");
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 */
function install(aData, aReason) {
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 */
function uninstall(aData, aReason) {
}

// nsIWindowMediatorListener
const WindowListener = {

  /**
   * @param {Window} aXulWindow
   */
  onOpenWindow(aXulWindow) {
    const domWindow = aXulWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                    .getInterface(Ci.nsIDOMWindow);

    // Wait finish loading
    domWindow.addEventListener("load", function onLoad(aEvent) {
      domWindow.removeEventListener("load", onLoad, false);

      SetupHelper.setup(domWindow, aEvent);
    }, false);
  },

  onCloseWindow(aXulWindow) {},

  onWindowTitleChange(aWindow, aNewTitle) {}
};

const SetupHelper = {

  /**
   * @param {Window} aDomWindow
   */
  setup(aDomWindow) {
    const windowType = aDomWindow.document.
                     documentElement.getAttribute("windowtype");
    // If this isn't a browser window then abort setup.
    if (windowType !== "navigator:browser") {
      return;
    }

    const linkplaces = new LinkplacesBrowserUI(aDomWindow, getLinkplacesService());
    gObjectMap.set(aDomWindow, linkplaces);
  },

  /**
   * @param {Window} aDomWindow
   */
  teardown(aDomWindow) {
    const linkplaces = gObjectMap.get(aDomWindow);
    if (!!linkplaces) {
      linkplaces.finalize();
    }
  },

};

class ChromeDocObserver {
  constructor() {
    Services.obs.addObserver(this, "chrome-document-global-created", false);
  }

  finalize() {
    Services.obs.removeObserver(this, "chrome-document-global-created");
  }

  observe(win, topic, data) {
    win.addEventListener("DOMContentLoaded", this, false);
  }

  handleEvent(event) {
    const win = event.currentTarget;
    win.removeEventListener("DOMContentLoaded", this, false);

    this.onDOMContentLoaded(win);
  }

  onDOMContentLoaded(win) {
      const uri = win.location.href;
      switch (uri) {
        case "chrome://browser/content/browser.xul":
        case "chrome://browser/content/history/history-panel.xul":
        case "chrome://browser/content/bookmarks/bookmarksPanel.xul":
        case "chrome://browser/content/places/places.xul":
          new LinkPlacesPlacesUI(win);
          break;
    }
  }
}

class LinkPlacesPlacesUI {
  constructor(win) {
    this._win = win;
    this._dom = null;

    const dom = win.document.createElement("menuitem");
    dom.setAttribute("id", "linkplaces-placesCtx-saveItems");
    dom.setAttribute("label", "Add to LinkPlaces"); // FIXME: i18n
    dom.setAttribute("selection", "link");
    dom.setAttribute("forcehideselection", "bookmark");
    dom.addEventListener("command", this, false);
    this._dom = dom;

    const mp = win.document.querySelector("#placesContext_cut + menuitem");
    mp.parentNode.insertBefore(dom, mp);

    win.addEventListener("unload", this, false);
  }

  handleEvent(event) {
    switch (event.type) {
      case "command":
        this.saveAllItems();
        break;
      case "unload":
        this.finalize();
        break;
    }
  }

  finalize() {
    this._dom.removeEventListener("command", this, false);
    this._win.removeEventListener("unload", this, false);

    this._win = null;
  }

  get service () {
    return getLinkplacesService();
  }

  get ctxMenu () {
    return this._win.document.getElementById("placesContext");
  }

  saveAllItems() {
    let triggerNode = this.ctxMenu.triggerNode;
    let nodesArray = this._win.PlacesUIUtils.getViewForNode(triggerNode).selectedNodes;
    let items = [];
    for (let node of nodesArray) {
      if (this._win.PlacesUtils.nodeIsURI(node)) {
        items.push({
          uri  : node.uri,
          title: node.title,
        });
      }
    }
    this.service.saveItems(items);
  }
}
