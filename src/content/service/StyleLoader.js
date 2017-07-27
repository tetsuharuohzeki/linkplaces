/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Cc, Ci, Services } from "./chrome";

const URI = "chrome://linkplaces/skin/linkplaces.css";

export class StyleLoader {

  static create() {
    const inst = new StyleLoader();
    inst.init();
    return inst;
  }

  constructor() {
    this._list = [URI];
    this._cssService = Cc["@mozilla.org/content/style-sheet-service;1"]
      .getService(Ci.nsIStyleSheetService);
  }

  init() {
    for (const uri of this._list) {
      const io = Services.io.newURI(uri, null, null);
      this._cssService.loadAndRegisterSheet(io, this._cssService.AUTHOR_SHEET);
    }
  }

  destroy() {
    const cssService = this._cssService;
    for (const uri of this._list) {
      const io = Services.io.newURI(uri, null, null);
      if (cssService.sheetRegistered(io, cssService.AUTHOR_SHEET)) {
        cssService.unregisterSheet(io, cssService.AUTHOR_SHEET);
      }
    }

    this._cssService = null;
  }
}
