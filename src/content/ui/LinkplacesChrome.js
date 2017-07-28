/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { LinkplacesChromeSidebar } from "./LinkplacesChromeSidebar.js";

export class LinkplacesChrome {
  static create(win, service){
    const obj = new LinkplacesChrome(win, service);
    win.gLinkplacesBrowserUI = obj; // eslint-disable-line no-param-reassign
    return obj;
  }

  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._sidebar = null;

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._win.gLinkplacesBrowserUI = null;
    this._sidebar = null;
    this._service = null;
    this._win = null;
  }

  _init() {
    this._sidebar = new LinkplacesChromeSidebar(this._win, this);

    this._win.addEventListener("unload", this, false);
  }

  _finalize() {
    this._win.removeEventListener("unload", this, false);

    this._sidebar.destroy();
  }

  service() {
    return this._service;
  }

  handleEvent(event) {
    switch (event.type) {
      case "unload":
        this.destroy();
        break;
    }
  }
}
