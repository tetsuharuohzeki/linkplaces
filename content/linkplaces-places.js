/* vim: set filetype=javascript shiftwidth=2 tabstop=2 noexpandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService",
                                  "resource://linkplaces/LinkplacesService.js");

var LinkplacesPlaces = {

  get service () {
    return LinkplacesService;
  },

  get ctxMenu () {
    return document.getElementById("placesContext");
  },

  saveAllItems: function () {
    let triggerNode = this.ctxMenu.triggerNode;
    let nodesArray = PlacesUIUtils.getViewForNode(triggerNode).selectedNodes;
    let items = [];
    for (let node of nodesArray) {
      if (PlacesUtils.nodeIsURI(node)) {
        items.push({
          uri  : node.uri,
          title: node.title,
        });
      }
    }
    this.service.saveItems(items);
  },

};
