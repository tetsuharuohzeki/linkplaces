/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

const {
  LinkplacesChromeContentCtxMenu,
  LinkplacesChromeTabCtxMenu,
} = require("./ui/LinkplacesChromeCtxMenu.js");
const { LinkplacesChromeSidebar } = require("./ui/LinkplacesChromeSidebar.js");
const { LinkPlacesChromePanel } = require("./ui/LinkPlacesChromePanel.js");
const { LinkplacesChromeToolbar } = require("./ui/LinkplacesChromeToolbar.js");

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
    this._sidebar = null;
    this._panel = null;
    this._toolbar = null;
    win.gLinkplacesBrowserUI = this; // eslint-disable-line no-param-reassign

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._win.gLinkplacesBrowserUI = null;
    this._toolbar = null;
    this._panel = null;
    this._sidebar = null;
    this._tabCtx = null;
    this._contextCtxMenu = null;
    this._service = null;
    this._win = null;
  }

  _init() {
    this._contextCtxMenu = new LinkplacesChromeContentCtxMenu(this._win, this);
    this._tabCtx = new LinkplacesChromeTabCtxMenu(this._win, this);
    this._sidebar = new LinkplacesChromeSidebar(this._win, this);
    this._panel = new LinkPlacesChromePanel(this._win, this._service);
    this._toolbar = new LinkplacesChromeToolbar(this._win, this._service);

    this._win.addEventListener("unload", this, false);
  }

  _finalize() {
    this._toolbar.destroy();
    this._panel.destroy();
    this._sidebar.destroy();
    this._tabCtx.destroy();
    this._contextCtxMenu.destroy();
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

  panel() {
    return this._panel;
  }

  toolbarToggleButton() {
    return this._toolbar;
  }
}

module.exports = Object.freeze({
  LinkplacesChrome,
});
