/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService",
                                  "resource://linkplaces/LinkplacesService.jsm");

var LinkplacesMultipleTab = {

  ElmId_tabCtxSaveTab: "linkplaces-tabCtx-saveTab",

  get service () {
    return LinkplacesService;
  },

  handleEvent: function (aEvent) {
    switch (aEvent.type) {
      case "load":
        this.onLoad();
        break;
    }
  },

  onLoad: function () {
    window.removeEventListener("load", this, false);

    this.deleteItemFromTabCtx();
  },

  deleteItemFromTabCtx: function () {
    let tabContextMenu = gBrowser.tabContextMenu;
    let menuitem = document.getElementById(this.ElmId_tabCtxSaveTab);
    tabContextMenu.removeChild(menuitem);
  },

  saveSelectedTabs: function () {
    let items = MultipleTabService.getSelectedTabs().map(function(aTab){
      let browser = aTab.linkedBrowser;
      let uri     = browser.currentURI.spec
      // FIXME: don't use CPOW.
      let title   = browser.contentDocumentAsCPOW.title || uri;
      return { uri: uri, title:title };
    }, this);
    this.service.saveItems(items);
  },
};
window.addEventListener("load", LinkplacesMultipleTab, false);
