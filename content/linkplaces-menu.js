/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global
  PlacesUtils: false,
  PlacesUIUtils:false,
  PlacesCommandHook:false,
  PanelUI:false,
*/

"use strict";

/*global XPCOMUtils:false*/
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
/*global LinkplacesService:false*/
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService", //eslint-disable-line no-invalid-this
  "resource://linkplaces/LinkplacesService.js");

// Load immidiately to initialize the UI Widget.
Components.utils.import("resource://linkplaces/LinkplacesUIWidget.js");

window.LinkPlacesUI = {

  onPanelMenuViewCommand(aEvent, aView) { // eslint-disable-line camelcase
    const target = aEvent.originalTarget;
    if (!target._placesNode) { // eslint-disable-line no-underscore-dangle
      return;
    }
    if (PlacesUtils.nodeIsContainer(target._placesNode)) { // eslint-disable-line no-underscore-dangle
      PlacesCommandHook.showPlacesOrganizer([ "BookmarksMenu", target._placesNode.itemId ]); // eslint-disable-line no-underscore-dangle
    }
    else {
      const node = target._placesNode; // eslint-disable-line no-underscore-dangle
      const where = this.whereToOpenLink(aEvent, node.uri);
      PlacesUIUtils.openNodeIn(node, where, aView);
      LinkplacesService.removeItem(node.itemId);
    }
    PanelUI.hide();
  },

  whereToOpenLink(aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) { // eslint-disable-line no-script-url
      // for bookmarklet
      rv = "current";
    }
    else {
      const where = window.whereToOpenLink(aEvent);
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

};

