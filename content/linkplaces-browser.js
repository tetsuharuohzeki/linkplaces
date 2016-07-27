/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
/* global Components: false */
"use strict";

/*global
  gContextMenu: false,
  browserDragAndDrop: false,
  TabContextMenu: false,
  gBrowser: false,
  PlacesControllerDragHelper: false,
  InsertionPoint: false,
*/

/*global XPCOMUtils:false*/
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
/*global LinkplacesService:false*/
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService", //eslint-disable-line no-invalid-this
  "chrome://linkplaces/content/LinkplacesService.js");

window.LinkplacesBrowser = {

  ElmIdContentCtxSavePage: "linkplaces-contentCtx-savePage",
  ElmIdContentCtxSaveLink: "linkplaces-contentCtx-saveLink",

  get service() {
    return LinkplacesService;
  },

  handleEvent: function (aEvent) {
    switch (aEvent.type) {
      case "load":
        this.onLoad();
        break;
      case "popupshowing":
        if (aEvent.target.id === "contentAreaContextMenu") {
          this.handleContentCtxPopup();
        }
        break;
      case "unload":
        this.onUnLoad();
        break;
    }
  },

  onLoad: function () {
    window.removeEventListener("load", this, false);
    window.addEventListener("unload", this, false);

    //set Context menu
    this.initContext();
  },

  onUnLoad: function() {
    window.removeEventListener("unload", this, false);

    this.finalizeContext();
  },

  initContext: function () {
    const contentAreaCtx = document.getElementById("contentAreaContextMenu");
    contentAreaCtx.addEventListener("popupshowing", this, false);
  },

  finalizeContext: function () {
    const contentAreaCtx = document.getElementById("contentAreaContextMenu");
    contentAreaCtx.removeEventListener("popupshowing", this, false);
  },

  handleContentCtxPopup: function () {
    gContextMenu.showItem(this.ElmIdContentCtxSavePage,
                          !(gContextMenu.isContentSelected || gContextMenu.onTextInput || gContextMenu.onLink ||
                            gContextMenu.onImage || gContextMenu.onVideo || gContextMenu.onAudio));
    gContextMenu.showItem(this.ElmIdContentCtxSaveLink,
                          gContextMenu.onLink && !gContextMenu.onMailtoLink);
  },

  saveLink: function () {
    this.service.saveItem(gContextMenu.linkURL, gContextMenu.linkTextStr);
  },

  saveThisPage: function () {
    this.saveTab(gBrowser.selectedTab);
  },

  saveThisTab: function () {
    this.saveTab(TabContextMenu.contextTab);
  },

  saveTab: function (aTab) {
    const browser = aTab.linkedBrowser;
    const uri = browser.currentURI.spec;
    const title = browser.contentTitle || uri;
    this.service.saveItem(uri, title);
  },

// based on bookmarksButtonObserver class and browserDragAndDrop class
  ButtonOnDrop: function (aEvent) {
    const service = this.service;
    const ip = new InsertionPoint(service.folder,
                                service.DEFAULT_INDEX,
                                Components.interfaces.nsITreeView.DROP_ON);
    PlacesControllerDragHelper.onDrop(ip, aEvent.dataTransfer);
  },

  ButtonOnDragOver: function (aEvent) {
    browserDragAndDrop.dragOver(aEvent);
    aEvent.dropEffect = "link"; // eslint-disable-line no-param-reassign
  },

  ButtonOnDragExit: function (/* aEvent */) { // eslint-disable-line no-empty-function
  }

};
window.addEventListener("load", window.LinkplacesBrowser, false);
