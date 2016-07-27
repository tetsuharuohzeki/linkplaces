/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

// eslint-disable-next-line no-unused-vars
const EXPORTED_SYMBOLS = ["LinkplacesChrome"];

const Cu = Components.utils;
const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
const {
  LinkplacesChromeContentCtxMenu,
  LinkplacesChromeTabCtxMenu,
} = require("./ui/LinkplacesChromeCtxMenu.js");

class LinkplacesChrome {
  static create(win, service){
    const obj = new LinkplacesChrome(win, service);
    return obj;
  }

  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._contextCtxMenu = null;
    this._tabCtx = null;
    win.gLinkplacesBrowserUI = this; // eslint-disable-line no-param-reassign
  }

  destroy() {
    this.finalize();

    this._win.gLinkplacesBrowserUI = null;
    this._tabCtx = null;
    this._contextCtxMenu = null;
    this._service = null;
    this._win = null;
  }

  init() {
    this._contextCtxMenu = new LinkplacesChromeContentCtxMenu(this._win, this);
    this._tabCtx = new LinkplacesChromeTabCtxMenu(this._win, this);

    this._win.addEventListener("unload", this, false);
  }

  finalize() {
    this._tabCtx.destroy();
    this._ctxMenu.destroy();
  }

  service() {
    return this._service;
  }

  handleEvent(event) {
    switch (event.type) {
      case "unload":
        this.onUnload(event);
        break;
    }
  }

  onUnload() {
    this._win.removeEventListener("unload", this, false);
    this.destroy();
  }

  saveLink() {
    const gContextMenu = this._win.gContextMenu;
    this._service.saveItem(gContextMenu.linkURL, gContextMenu.linkTextStr);
  }

  saveThisPage() {
    const gBrowser = this._win.gBrowser;
    this.saveTab(gBrowser.selectedTab);
  }

  saveThisTab() {
    const TabContextMenu = this._win.TabContextMenu;
    this.saveTab(TabContextMenu.contextTab);
  }

  saveTab(aTab) {
    const browser = aTab.linkedBrowser;
    const uri = browser.currentURI.spec;
    const title = browser.contentTitle || uri;
    this._service.saveItem(uri, title);
  }
}
this.LinkplacesChrome = LinkplacesChrome; // eslint-disable-line no-invalid-this
