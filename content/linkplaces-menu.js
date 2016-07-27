/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService",
  "resource://linkplaces/LinkplacesService.js");

// Load immidiately to initialize the UI Widget.
Components.utils.import("resource://linkplaces/LinkplacesUIWidget.js");

var LinkPlacesUI = {

  onPanelMenuViewCommand: function BUI_onPanelMenuViewCommand(aEvent, aView) {
    let target = aEvent.originalTarget;
    if (!target._placesNode) {
      return;
    }
    if (PlacesUtils.nodeIsContainer(target._placesNode)) {
      PlacesCommandHook.showPlacesOrganizer([ "BookmarksMenu", target._placesNode.itemId ]);
    }
    else {
      let node = target._placesNode;
      let where = this.whereToOpenLink(aEvent, node.uri);
      PlacesUIUtils.openNodeIn(node, where, aView);
      LinkplacesService.removeItem(node.itemId);
    }
    PanelUI.hide();
  },

  whereToOpenLink: function (aEvent, aURI) {
    let rv = "";
    if (aURI.startsWith("javascript:")) {
      // for bookmarklet
      rv = "current";
    }
    else {
      let where = window.whereToOpenLink(aEvent);
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

