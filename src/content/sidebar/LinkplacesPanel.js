/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components: false */

// XXX: This should be loaded from the sidebar script.
"use strict"; // eslint-disable-line strict, lines-around-directive

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["LinkplacesPanel"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const { PlacesUtils } = Cu.import("resource://gre/modules/PlacesUtils.jsm", {});
const { PlacesUIUtils } = Cu.import("resource:///modules/PlacesUIUtils.jsm", {});

// XXX:
// Mozilla's [JavaScript Code Module](https://developer.mozilla.org/en/docs/Mozilla/JavaScript_code_modules)
// treats this at top level in a source as a global object per module,
// and `Cu.import()` depends on it.
// So we need to some problem, use `var` for exported items.
var LinkplacesPanel = class LinkplacesPanel { // eslint-disable-line no-var, no-unused-vars

  /**
   *  @constructor
   *  @param  {XulWindow} aWindow
   */
  constructor(aWindow) {
    this.window = aWindow;
    this.treeView = null;
    this.ctxMenu = null;
    this.placesController = null;
    this._service = aWindow.top.gLinkplacesBrowserUI.service();

    Object.seal(this);

    aWindow.addEventListener("load", this, false);
  }

  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "load":
        this.onLoad();
        break;
      case "unload":
        this.onUnLoad();
        break;
      case "SidebarFocused":
        this.onSidebarFocused();
        break;
      case "click": // for TreeView
        this.handleTreeClick(aEvent, true);
        break;
      case "keypress": // for TreeView
        this.handleTreeKeyPress(aEvent);
        break;
      case "mousemove": // for TreeView
        this.handleTreeMouseMove(aEvent);
        break;
      case "mouseout": // for TreeView
        this.setMouseoverURL("");
        break;
    }
  }

  onLoad() {
    const window = this.window;
    window.removeEventListener("load", this, false);

    // initialize
    [this.treeView, this.placesController] = this.initPlacesView();

    this.ctxMenu = window.document.getElementById("placesContext");
    this.overrideCmdOpenMultipleItem();

    window.addEventListener("unload", this, false);
    window.addEventListener("SidebarFocused", this, false);
  }

  onUnLoad() {
    this.window.removeEventListener("unload", this, false);
    this.window.removeEventListener("SidebarFocused", this, false);

    this.setMouseoverURL("");

    this.finalizePlacesView();

    this._service = null;
    this.ctxMenu = null;
    this.placesController = null;
    this.treeView = null;
  }

  onSidebarFocused() {
    this.treeView.focus();
  }

  initPlacesView() {
    const window = this.window;

    const treeView = window.document.getElementById("linkplaces-view");
    const placesController = createCustomPlacesController(window.PlacesController, treeView, this);

    treeView.place = this._service.QUERY_URI;
    treeView.controllers.insertControllerAt(0, placesController);

    treeView.addEventListener("click", this, false);
    treeView.addEventListener("keypress", this, false);
    treeView.addEventListener("mousemove", this, false);
    treeView.addEventListener("mouseout", this, false);

    return [treeView, placesController];
  }

  finalizePlacesView() {
    this.treeView.removeEventListener("click", this, false);
    this.treeView.removeEventListener("keypress", this, false);
    this.treeView.removeEventListener("mousemove", this, false);
    this.treeView.removeEventListener("mouseout", this, false);

    // finalize
    this.treeView.controllers.removeControllerAt(0);
  }

  overrideCmdOpenMultipleItem() {
    const cmdValue = `
      var triggerNode = window.gLinkplacesPanel.ctxMenu.triggerNode;
      var controller = PlacesUIUtils.getViewForNode(triggerNode).controller;
      window.gLinkplacesPanel.openSelectionInTabs(controller, event);
    `;
    const document = this.window.document;
    const list = [
      "placesContext_openContainer:tabs",
      "placesContext_openLinks:tabs",
    ];
    for (let id of list) { // eslint-disable-line prefer-const
      document.getElementById(id).setAttribute("oncommand", cmdValue);
    }
  }

  // Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
  handleTreeClick(aEvent, aGutterSelect) {
    // When right button click
    if (aEvent.button === 2) {
      return;
    }

    const tree = aEvent.target.parentNode;
    const treeBoxObj = tree.treeBoxObject;
    const row = {};
    const col = {};
    const obj = {};
    treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

    if (row.value === -1 || obj.value === "twisty") {
      return;
    }

    // whether mouse in opening item area or not.
    let mouseInGutter = false;
    const cellX = {};
    const cellY = {};
    const cellW = {};
    const cellH = {};
    if (aGutterSelect) {
      treeBoxObj.getCoordsForCellItem(row.value, col.value, "image", cellX, cellY, cellW, cellH);

      const isRTL = (this.window.getComputedStyle(tree, null).direction === "rtl");
      if (isRTL) {
        mouseInGutter = (aEvent.clientX > cellX.value);
      }
      else {
        mouseInGutter = (aEvent.clientX < cellX.value);
      }
    }

    const modifKey = (aEvent.ctrlKey || aEvent.metaKey) || aEvent.shiftKey;
    const isContainer = treeBoxObj.view.isContainer(row.value);
    const openInTabs = isContainer &&// Is the node container?
                     // Is event is middle-click, or left-click with ctrlkey?
                     (aEvent.button === 1 || (aEvent.button === 0 && modifKey)) &&
                     //Does the node have child URI node?
                     PlacesUtils.hasChildURIs(treeBoxObj.view.nodeForTreeIndex(row.value));

    if (aEvent.button === 0 && isContainer && !openInTabs) {
      treeBoxObj.view.toggleOpenState(row.value);
    }
    else if (!mouseInGutter && aEvent.originalTarget.localName === "treechildren") {
      if (openInTabs) {
        treeBoxObj.view.selection.select(row.value);
        PlacesUIUtils.openContainerNodeInTabs(tree.selectedNode, aEvent);
        this.focusSidebarWhenItemsOpened();
        this._service.removeItem(tree.selectedNode.itemId);
      }
      else if (!isContainer) {
        treeBoxObj.view.selection.select(row.value);
        this.openNodeWithEvent(tree.selectedNode, aEvent, this.treeView);
      }
    }
  }

  handleTreeKeyPress(aEvent) {
    if (aEvent.keyCode === Ci.nsIDOMKeyEvent.DOM_VK_RETURN) {
      const node = aEvent.target.selectedNode;
      if (PlacesUtils.nodeIsURI(node)) {
        this.openNodeWithEvent(node, aEvent, this.treeView);
      }
    }
  }

  handleTreeMouseMove(aEvent) {
    if (aEvent.target.localName !== "treechildren") {
      return;
    }

    const tree = aEvent.target.parentNode;
    const treeBoxObj = tree.treeBoxObject;
    const row = {};
    const col = {};
    const obj = {};
    treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

    if (row.value !== -1) {
      const node = tree.view.nodeForTreeIndex(row.value);
      if (PlacesUtils.nodeIsURI(node)) {
        this.setMouseoverURL(node.uri);
      }
      else {
        this.setMouseoverURL("");
      }
    }
    else {
      this.setMouseoverURL("");
    }
  }

  setMouseoverURL(aURI) {
    const XULBrowserWindow = this.window.top.XULBrowserWindow;
    // When the browser window is closed with an open sidebar, the sidebar
    // unload event happens after the browser's one.  In this case
    // top.XULBrowserWindow has been nullified already.
    if (XULBrowserWindow) {
      XULBrowserWindow.setOverLink(aURI, null);
    }
  }

  openNodeWithEvent(aNode, aEvent, aView) {
    const uri = aNode.uri;
    const win = this.window;
    const service = this._service;
    const where = service.whereToOpenLink(win.whereToOpenLink, aEvent, uri);
    let result = null;
    if (PlacesUtils.nodeIsSeparator(aNode)) {
      result = Promise.resolve({ ok: true });
    }
    else if (service.isPrivilegedScheme(uri)) {
      this.window.PlacesUIUtils.openNodeIn(aNode, where, aView);
      result = Promise.resolve({ ok: true });
    }
    else {
      result = service.openTab(uri, where);
    }
    result.then((result) => {
      if (result.ok) {
        this.focusSidebarWhenItemsOpened();
        service.removeItem(aNode.itemId);
      }
      else {
        this.window.console.error(result.error);
      }
    }).catch(this.window.console.error);
  }

  openSelectionInTabs(aController, aEvent) {
    aController.openSelectionInTabs(aEvent);

    this.focusSidebarWhenItemsOpened();

    if (aController && aController.isCommandEnabled("placesCmd_delete")) {
      aController.doCommand("placesCmd_delete");
    }
  }

  focusSidebarWhenItemsOpened() {
    if (this._service.config().shouldFocusOnSidebarWhenOpenItem()) {
      this.treeView.focus();
    }
  }
};

/*
 *  @param  {function(new:PlacesController)}  ControllerConstructor
 *  @param  {Element}                         aTreeView
 *  @param  {LinkplacesPanel}                 aLinkplacesPanel
 *  @return {PlacesController}
 */
// eslint-disable-next-line no-implicit-globals
function createCustomPlacesController(ControllerConstructor, aTreeView, aLinkplacesPanel) {
  const placesController = new ControllerConstructor(aTreeView);
  placesController._isCommandEnabled = placesController.isCommandEnabled; // eslint-disable-line no-underscore-dangle
  placesController.isCommandEnabled = function (aCmd) {
    switch (aCmd) {
      case "placesCmd_new:bookmark":
      case "placesCmd_createBookmark":// for History
      case "placesCmd_deleteDataHost":// for History
      case "placesCmd_reload":
      case "placesCmd_reloadMicrosummary":
      case "placesCmd_sortBy:name":
        return false;
      default:
        return this._isCommandEnabled(aCmd);
    }
  };

  placesController._doCommand = placesController.doCommand; // eslint-disable-line no-underscore-dangle
  placesController.doCommand = function (aCmd) {
    this._doCommand(aCmd);
    switch (aCmd) {
      case "placesCmd_open":
      case "placesCmd_open:window":
      case "placesCmd_open:tab":
        aLinkplacesPanel.focusSidebarWhenItemsOpened();
        this._service.removeItem(this._view.selectedNode.itemId);
        break;
    }
  };

  return placesController;
}
