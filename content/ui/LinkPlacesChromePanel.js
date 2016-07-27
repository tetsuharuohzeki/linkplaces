/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

class LinkPlacesChromePanel {

  constructor(win, service) {
    this._win = win;
    this._service = service;

    this._init();
  }

  destroy() {
    this._finalize();

    this._service = null;
    this._win = null;
  }

  _init() {
    // noop
  }

  _finalize() {
    // noop
  }

  onPanelMenuViewCommand(aEvent, aView) {
    const window = this._win;
    const target = aEvent.originalTarget;
    const placesNode = target._placesNode; // eslint-disable-line no-underscore-dangle
    if (!placesNode) {
      return;
    }

    if (window.PlacesUtils.nodeIsContainer(placesNode)) {
      window.PlacesCommandHook.showPlacesOrganizer([ "BookmarksMenu", placesNode.itemId ]);
    }
    else {
      const node = placesNode;
      const where = this.whereToOpenLink(aEvent, node.uri);
      window.PlacesUIUtils.openNodeIn(node, where, aView);
      this._service.removeItem(node.itemId);
    }
    window.PanelUI.hide();
  }

  whereToOpenLink(aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) { // eslint-disable-line no-script-url
      // for bookmarklet
      rv = "current";
    }
    else {
      const window = this._win;
      const where = window.whereToOpenLink(aEvent);
      switch (where) {
        case "current":
          rv = this._service.config().openLinkTo();
          break;
        default:
          rv = where;
          break;
      }
    }
    return rv;
  }
}

module.exports = Object.freeze({
  LinkPlacesChromePanel,
});
