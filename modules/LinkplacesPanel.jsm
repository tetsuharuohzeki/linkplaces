/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

let EXPORTED_SYMBOLS = ["LinkplacesPanel"];

const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://linkplaces/LinkplacesService.jsm");
Cu.import("resource://gre/modules/PlacesUtils.jsm");
Cu.import("resource:///modules/PlacesUIUtils.jsm");

function LinkplacesPanel (aWindow) {
  this.window = aWindow;
  this.treeView = null;
  this.ctxMenu = null;
  this.placesController = null;

  aWindow.addEventListener("load", this, false);
}
LinkplacesPanel.prototype = {

  handleEvent: function (aEvent) {
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
  },

  onLoad: function () {
    let window = this.window;
    window.removeEventListener("load", this, false);

    // initialize
    [this.treeView, this.placesController] = this.initPlacesView();

    this.ctxMenu = window.document.getElementById("placesContext");
    this.overrideCmdOpenMultipleItem();

    window.addEventListener("unload", this, false);
    window.addEventListener("SidebarFocused", this, false);
  },

  onUnLoad: function() {
    this.window.removeEventListener("unload", this, false);
    this.window.removeEventListener("SidebarFocused", this, false);

    this.setMouseoverURL("");

    this.finalizePlacesView();

    this.ctxMenu  = null;
    this.placesController = null;
    this.treeView = null;
  },

  onSidebarFocused: function () {
    this.treeView.focus();
  },

  initPlacesView: function() {
    let window = this.window;

    let treeView = window.document.getElementById("linkplaces-view");
    let placesController = createCustomPlacesController(window.PlacesController, treeView);

    treeView.place = "place:queryType=1&folder=UNFILED_BOOKMARKS";
    treeView.controllers.insertControllerAt(0, placesController);

    treeView.addEventListener("click", this, false);
    treeView.addEventListener("keypress", this, false);
    treeView.addEventListener("mousemove", this, false);
    treeView.addEventListener("mouseout", this, false);

    return [treeView, placesController];
  },

  finalizePlacesView: function () {
    this.treeView.removeEventListener("click", this, false);
    this.treeView.removeEventListener("keypress", this, false);
    this.treeView.removeEventListener("mousemove", this, false);
    this.treeView.removeEventListener("mouseout", this, false);

    // finalize
    this.treeView.controllers.removeControllerAt(0);
  },

  overrideCmdOpenMultipleItem: function () {
    let cmdValue = "\
      var triggerNode = LinkplacesPanel.ctxMenu.triggerNode;\
      var controller = PlacesUIUtils.getViewForNode(triggerNode).controller;\
      LinkplacesPanel.openSelectionInTabs(controller, event);\
    ";
    let document = this.window.document;
    ["placesContext_openContainer:tabs",
     "placesContext_openLinks:tabs"].forEach(function(aElm){
      document.getElementById(aElm).setAttribute("oncommand", cmdValue.toString());
    });
  },

  // Based on "chrome://browser/content/bookmarks/sidebarUtils.js"
  handleTreeClick: function (aEvent, aGutterSelect) {
    // When right button click
    if (aEvent.button === 2) {
      return;
    }

    let tree = aEvent.target.parentNode;
    let treeBoxObj = tree.treeBoxObject;
    let row = {}, col = {}, obj = {};
    treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

    if (row.value === -1 ||  obj.value === "twisty") {
      return;
    }

    // whether mouse in opening item area or not.
    let mouseInGutter = false;
    let cellX = {}, cellY = {}, cellW = {}, cellH = {};
    if (aGutterSelect) {
      treeBoxObj.getCoordsForCellItem(row.value, col.value, "image", cellX, cellY, cellW, cellH);

      let isRTL = (this.window.getComputedStyle(tree, null).direction === "rtl");
      if (isRTL) {
        mouseInGutter = (aEvent.clientX > cellX.value);
      }
      else {
        mouseInGutter = (aEvent.clientX < cellX.value);
      }
    }

    let modifKey = (aEvent.ctrlKey || aEvent.metaKey) || aEvent.shiftKey;
    let isContainer = treeBoxObj.view.isContainer(row.value);
    let openInTabs = isContainer &&// Is the node container?
                     // Is event is middle-click, or left-click with ctrlkey?
                     (aEvent.button === 1 || (aEvent.button === 0 && modifKey)) &&
                     //Does the node have child URI node?
                     PlacesUtils.hasChildURIs(treeBoxObj.view.nodeForTreeIndex(row.value));

    if (aEvent.button === 0 && isContainer && !openInTabs) {
      treeBoxObj.view.toggleOpenState(row.value);
      return;
    }
    else if (!mouseInGutter && aEvent.originalTarget.localName === "treechildren") {
      if (openInTabs) {
        treeBoxObj.view.selection.select(row.value);
        PlacesUIUtils.openContainerNodeInTabs(tree.selectedNode, aEvent);
        this.focusSidebarWhenItemsOpened();
        LinkplacesService.removeItem(tree.selectedNode.itemId);
      }
      else if (!isContainer) {
        treeBoxObj.view.selection.select(row.value);
        this.openNodeWithEvent(tree.selectedNode, aEvent, this.treeView);
      }
    }
  },

  handleTreeKeyPress: function (aEvent) {
    if (aEvent.keyCode === Ci.nsIDOMKeyEvent.DOM_VK_RETURN) {
      let node = aEvent.target.selectedNode;
      if (PlacesUtils.nodeIsURI(node)) {
        this.openNodeWithEvent(node, aEvent, this.treeView);
      }
    }
  },

  handleTreeMouseMove: function (aEvent) {
    if (aEvent.target.localName !== "treechildren") {
      return;
    }

    let tree = aEvent.target.parentNode;
    let treeBoxObj = tree.treeBoxObject;
    let row = {}, col = {}, obj = {};
    treeBoxObj.getCellAt(aEvent.clientX, aEvent.clientY, row, col, obj);

    if (row.value !== -1) {
      let node = tree.view.nodeForTreeIndex(row.value);
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
  },

  setMouseoverURL: function (aURI) {
    let XULBrowserWindow = this.window.top.XULBrowserWindow;
    // When the browser window is closed with an open sidebar, the sidebar
    // unload event happens after the browser's one.  In this case
    // top.XULBrowserWindow has been nullified already.
    if (XULBrowserWindow) {
      XULBrowserWindow.setOverLink(aURI, null);
    }
  },

  openNodeWithEvent: function (aNode, aEvent, aView) {
    let where = this.whereToOpenLink(aEvent, aNode.uri);

    PlacesUIUtils.openNodeIn(aNode, where, aView);

    this.focusSidebarWhenItemsOpened();

    LinkplacesService.removeItem(aNode.itemId);
  },

  whereToOpenLink: function (aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) {
      // for bookmarklet
      rv = "current";
    }
    else {
      let where = this.window.whereToOpenLink(aEvent);
      switch (where) {
        case "current":
          rv = LinkplacesService.PREF.openLinkToWhere;
          break;
        default:
          rv = where;
          break;
      }
    }
    return rv;
  },

  openSelectionInTabs: function(aController, aEvent) {
    aController.openSelectionInTabs(aEvent);

    this.focusSidebarWhenItemsOpened();

    if (aController && aController.isCommandEnabled("placesCmd_delete")) {
      aController.doCommand("placesCmd_delete");
    }
  },

  focusSidebarWhenItemsOpened: function () {
    if (LinkplacesService.PREF.focusWhenItemsOpened_Sidebar) {
      this.treeView.focus();
    }
  },

};


/*
 *  @param  {function(new:PlacesController)}  aControllerConstructor
 *  @param  {Element}                         aTreeView
 *  @return {PlacesController}
 */
function createCustomPlacesController (aControllerConstructor, aTreeView) {
  let placesController = new aControllerConstructor(aTreeView);
  placesController._isCommandEnabled = placesController.isCommandEnabled;
  placesController.isCommandEnabled = function (aCmd) {
    switch (aCmd) {
      case "placesCmd_new:bookmark":
      case "placesCmd_new:folder":
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

  placesController._doCommand = placesController.doCommand;
  placesController.doCommand = function (aCmd) {
    this._doCommand(aCmd);
    switch (aCmd) {
      case "placesCmd_open":
      case "placesCmd_open:window":
      case "placesCmd_open:tab":
        aLinkplacesPanel.focusSidebarWhenItemsOpened();
        LinkplacesService.removeItem(this._view.selectedNode.itemId);
        break;
    }
  };

  return placesController;
}
