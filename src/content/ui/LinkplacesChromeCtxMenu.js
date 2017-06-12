/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ContextMenuItem } from "./contextmenu";

const ID_CONTENT_CTX_MENU = "contentAreaContextMenu";

const ID_TAB_CTX_SAVE_TAB = "linkplaces-tabCtx-saveTab";
const ID_CONTENT_SAVE_PAGE = "linkplaces-contentCtx-savePage";
const ID_CONTENT_SAVE_LINK = "linkplaces-contentCtx-saveLink";

export class LinkplacesChromeTabCtxMenu {
  constructor(win, parent) {
    this._win = win;
    this._parent = parent;
    this._saveThisTab = new ContextMenuItem(win, {
      id: ID_TAB_CTX_SAVE_TAB,
      label: parent.service().stringBundle.GetStringFromName("linkplaces.ctx.tab.saveThisTab"), // eslint-disable-line new-cap
      onCommand: () => {
        this._parent.saveThisTab();
      },
      mountpoint: "#context_bookmarkAllTabs + menuitem"
    });

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._saveThisTab = null;
    this._parent = null;
    this._win = null;
  }

  _init() {
    // noop
  }

  _finalize() {
    this._saveThisTab.destroy();
  }
}

export class LinkplacesChromeContentCtxMenu {
  constructor(win, parent) {
    this._win = win;
    this._parent = parent;
    this._savePage = new ContextMenuItem(win, {
      id: ID_CONTENT_SAVE_PAGE,
      label: parent.service().stringBundle.GetStringFromName("linkplaces.ctx.content.savePage"), // eslint-disable-line new-cap
      onCommand: () => {
        this._parent.saveThisPage();
      },
      mountpoint: "#context-savepage",
    });
    this._saveLink = new ContextMenuItem(win, {
      id: ID_CONTENT_SAVE_LINK,
      label: parent.service().stringBundle.GetStringFromName("linkplaces.ctx.content.saveLink"), // eslint-disable-line new-cap
      onCommand: () => {
        this._parent.saveLink();
      },
      mountpoint: "#context-bookmarklink + menuitem",
    });

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._saveLink = null;
    this._savePage = null;
    this._parent = null;
    this._win = null;
  }

  _init() {
    const ctx = this._win.document.getElementById(ID_CONTENT_CTX_MENU);
    ctx.addEventListener("popupshowing", this, false);
  }

  _finalize() {
    const ctx = this._win.document.getElementById(ID_CONTENT_CTX_MENU);
    ctx.removeEventListener("popupshowing", this, false);

    this._saveLink.destroy();
    this._savePage.destroy();
  }

  handleEvent(event) {
    switch (event.type) {
      case "popupshowing":
        if (event.target.id === ID_CONTENT_CTX_MENU) {
          this.onPopupShowing();
        }
        break;
    }
  }

  onPopupShowing() {
    const gContextMenu = this._win.gContextMenu;

    gContextMenu.showItem(ID_CONTENT_SAVE_PAGE,
      !(gContextMenu.isContentSelected || gContextMenu.onTextInput || gContextMenu.onLink ||
                            gContextMenu.onImage || gContextMenu.onVideo || gContextMenu.onAudio));
    gContextMenu.showItem(ID_CONTENT_SAVE_LINK,
      gContextMenu.onLink && !gContextMenu.onMailtoLink);
  }
}
