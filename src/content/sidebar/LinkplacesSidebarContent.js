/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components: false */

// XXX: This should be loaded from the sidebar script.
"use strict"; // eslint-disable-line strict, lines-around-directive

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["LinkplacesSidebarContent"];

const Ci = Components.interfaces;
const Cu = Components.utils;

const { AppConstants } = Cu.import("resource://gre/modules/AppConstants.jsm", {});
const { PlacesUtils } = Cu.import("resource://gre/modules/PlacesUtils.jsm", {});
const { PlacesUIUtils } = Cu.import("resource:///modules/PlacesUIUtils.jsm", {});

// XXX:
// Mozilla's [JavaScript Code Module](https://developer.mozilla.org/en/docs/Mozilla/JavaScript_code_modules)
// treats this at top level in a source as a global object per module,
// and `Cu.import()` depends on it.
// So we need to some problem, use `var` for exported items.
var LinkplacesSidebarContent = class LinkplacesSidebarContent { // eslint-disable-line no-var, no-unused-vars

  /**
   *  @constructor
   *  @param  {XulWindow} aWindow
   */
  constructor(aWindow) {
    this._window = aWindow;
    this._treeView = null;
    this._ctxMenu = null;
    this._placesController = null;
    this._service = aWindow.top.gLinkplacesBrowserUI.service();

    Object.seal(this);

    aWindow.addEventListener("load", this, false);
  }

  service() {
    return this._service;
  }

  get ctxMenu() {
    return this._ctxMenu;
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
    const window = this._window;
    window.removeEventListener("load", this, false);

    // initialize
    [this._treeView, this._placesController] = this.initPlacesView();

    this._ctxMenu = window.document.getElementById("placesContext");
    this.overrideCmdOpenMultipleItem();

    window.addEventListener("unload", this, false);
    window.addEventListener("SidebarFocused", this, false);
  }

  onUnLoad() {
    this._window.removeEventListener("unload", this, false);
    this._window.removeEventListener("SidebarFocused", this, false);

    this.setMouseoverURL("");

    this.finalizePlacesView();

    this._service = null;
    this._ctxMenu = null;
    this._placesController = null;
    this._treeView = null;
  }

  onSidebarFocused() {
    this._treeView.focus();
  }

  initPlacesView() {
    const window = this._window;

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
    this._treeView.removeEventListener("click", this, false);
    this._treeView.removeEventListener("keypress", this, false);
    this._treeView.removeEventListener("mousemove", this, false);
    this._treeView.removeEventListener("mouseout", this, false);

    // finalize
    this._treeView.controllers.removeControllerAt(0);
  }

  overrideCmdOpenMultipleItem() {
    const cmdValue = `
      var triggerNode = window.gLinkplacesSidebarContent.ctxMenu.triggerNode;
      var controller = PlacesUIUtils.getViewForNode(triggerNode).controller;
      window.gLinkplacesSidebarContent.openSelectionInTabs(controller, event);
    `;
    const document = this._window.document;
    const list = [
      "placesContext_openContainer:tabs",
      "placesContext_openLinks:tabs",
    ];
    for (let id of list) { // eslint-disable-line prefer-const
      document.getElementById(id).setAttribute("oncommand", cmdValue);
    }
  }

  // Based on mozilla-central/source/browser/components/places/content/sidebarUtils.js
  handleTreeClick(aEvent, aGutterSelect) {
    // right-clicks are not handled here
    if (aEvent.button === 2) {
      return;
    }

    const window = this._window;
    const aTree = aEvent.currentTarget;

    const tbo = aTree.treeBoxObject;
    const cell = tbo.getCellAt(aEvent.clientX, aEvent.clientY);

    if (cell.row === -1 || cell.childElt === "twisty") {
      return;
    }

    let mouseInGutter = false;
    if (aGutterSelect) {
      const rect = tbo.getCoordsForCellItem(cell.row, cell.col, "image");
      // getCoordsForCellItem returns the x coordinate in logical coordinates
      // (i.e., starting from the left and right sides in LTR and RTL modes,
      // respectively.)  Therefore, we make sure to exclude the blank area
      // before the tree item icon (that is, to the left or right of it in
      // LTR and RTL modes, respectively) from the click target area.
      const isRTL = window.getComputedStyle(aTree).direction === "rtl";
      if (isRTL) {
        mouseInGutter = aEvent.clientX > rect.x;
      }
      else {
        mouseInGutter = aEvent.clientX < rect.x;
      }
    }

    const metaKey = AppConstants.platform === "macosx" ?
      aEvent.metaKey :
      aEvent.ctrlKey;
    const modifKey = metaKey || aEvent.shiftKey;
    const isContainer = tbo.view.isContainer(cell.row);
    const openInTabs = isContainer &&// Is the node container?
      // Is event is middle-click, or left-click with ctrlkey?
      (aEvent.button === 1 || (aEvent.button === 0 && modifKey)) &&
      //Does the node have child URI node?
      PlacesUtils.hasChildURIs(tbo.view.nodeForTreeIndex(cell.row));

    if (aEvent.button === 0 && isContainer && !openInTabs) {
      tbo.view.toggleOpenState(cell.row);
    } else if (!mouseInGutter && openInTabs &&
            aEvent.originalTarget.localName === "treechildren") {
      tbo.view.selection.select(cell.row);
      PlacesUIUtils.openContainerNodeInTabs(aTree.selectedNode, aEvent, aTree);
      this.focusSidebarWhenItemsOpened();
      this._service.removeItem(aTree.selectedNode.bookmarkGuid);
    } else if (!mouseInGutter && !isContainer &&
             aEvent.originalTarget.localName === "treechildren") {
      // Clear all other selection since we're loading a link now. We must
      // do this *before* attempting to load the link since openURL uses
      // selection as an indication of which link to load.
      tbo.view.selection.select(cell.row);
      this.openNodeWithEvent(aTree.selectedNode);
    }
  }

  // Based on mozilla-central/source/browser/components/places/content/sidebarUtils.js
  handleTreeKeyPress(aEvent) {
    if (aEvent.keyCode === Ci.nsIDOMKeyEvent.DOM_VK_RETURN) {
      const node = aEvent.target.selectedNode;
      if (node) {
        this.openNodeWithEvent(node);
      }
    }
  }

  // Based on mozilla-central/source/browser/components/places/content/sidebarUtils.js
  handleTreeMouseMove(aEvent) {
    if (aEvent.target.localName !== "treechildren") {
      return;
    }

    const tree = aEvent.target.parentNode;
    const tbo = tree.treeBoxObject;
    const cell = tbo.getCellAt(aEvent.clientX, aEvent.clientY);

    // cell.row is -1 when the mouse is hovering an empty area within the tree.
    // To avoid showing a URL from a previously hovered node for a currently
    // hovered non-url node, we must clear the moused-over URL in these cases.
    if (cell.row !== -1) {
      const node = tree.view.nodeForTreeIndex(cell.row);
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

  // Based on mozilla-central/source/browser/components/places/content/sidebarUtils.js
  setMouseoverURL(aURL) {
    const top = this._window.top;
    // When the browser window is closed with an open sidebar, the sidebar
    // unload event happens after the browser's one.  In this case
    // top.XULBrowserWindow has been nullified already.
    if (top.XULBrowserWindow) {
      top.XULBrowserWindow.setOverLink(aURL, null);
    }
  }

  openNodeWithEvent(aNode) {
    const uri = aNode.uri;
    const service = this._service;
    let result = null;
    if (PlacesUtils.nodeIsSeparator(aNode)) {
      result = Promise.resolve({ ok: true });
    }
    else {
      result = service.openTab(uri);
    }
    result.then((result) => {
      if (result.ok) {
        this.focusSidebarWhenItemsOpened();
        return service.removeItem(aNode.bookmarkGuid);
      }
      else {
        return Promise.reject(result.error);
      }
    }).catch(this._window.console.error);
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
      this._treeView.focus();
    }
  }
};

/*
 *  @param  {function(new:PlacesController)}  ControllerConstructor
 *  @param  {Element}                         aTreeView
 *  @param  {LinkplacesSidebarContent}                 aLinkplacesSidebarContent
 *  @return {PlacesController}
 */
// eslint-disable-next-line no-implicit-globals
function createCustomPlacesController(ControllerConstructor, aTreeView, aLinkplacesSidebarContent) {
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
        aLinkplacesSidebarContent.focusSidebarWhenItemsOpened();
        aLinkplacesSidebarContent.service().removeItem(this._view.selectedNode.bookmarkGuid);
        break;
    }
  };

  return placesController;
}
