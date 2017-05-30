/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  LinkplacesChromeContentCtxMenu,
  LinkplacesChromeTabCtxMenu,
} from "./ui/LinkplacesChromeCtxMenu.js";
import { LinkplacesChromeSidebar } from "./ui/LinkplacesChromeSidebar.js";
import { LinkPlacesChromePanel } from "./ui/LinkPlacesChromePanel.js";

export class LinkplacesChrome {
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
    this._panelDOM = null;
    this._prefListener = null;
    win.gLinkplacesBrowserUI = this; // eslint-disable-line no-param-reassign

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._win.gLinkplacesBrowserUI = null;
    this._prefListener = null;
    this._panelDOM = null;
    this._panel = null;
    this._sidebar = null;
    this._tabCtx = null;
    this._contextCtxMenu = null;
    this._service = null;
    this._win = null;
  }

  _init() {
    if (!this._service.config().useWebExtContextMenu()) {
      this._createCtxMenu();
    }

    this._sidebar = new LinkplacesChromeSidebar(this._win, this);
    this._panel = new LinkPlacesChromePanel(this._win, this._service);

    this._win.addEventListener("unload", this, false);

    this._prefListener = (name, table) => {
      if (name !== "useWebExtContextMenu") {
        return;
      }

      if (table.useWebExtContextMenu) {
        this._destroyCtxMenu();
      }
      else {
        this._createCtxMenu();
      }
    };
    this._service.config().addListener(this._prefListener);
  }

  _finalize() {
    this._service.config().removeListener(this._prefListener);

    this._panel.destroy();
    this._sidebar.destroy();

    this._destroyCtxMenu();
  }

  _createCtxMenu() {
    if (this._contextCtxMenu === null) {
      this._contextCtxMenu = new LinkplacesChromeContentCtxMenu(this._win, this);
    }

    if (this._tabCtx === null) {
      this._tabCtx = new LinkplacesChromeTabCtxMenu(this._win, this);
    }
  }

  _destroyCtxMenu() {
    if (this._tabCtx !== null) {
      this._tabCtx.destroy();
      this._tabCtx = null;
    }

    if (this._contextCtxMenu !== null) {
      this._contextCtxMenu.destroy();
      this._contextCtxMenu = null;
    }
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
}
