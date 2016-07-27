/* vim: set filetype=javascript shiftwidth=2 tabstop=2 noexpandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global
  PlacesUtils: false,
  PlacesUIUtils:false,
*/

"use strict";

/*global XPCOMUtils:false*/
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
/*global LinkplacesService:false*/
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService", //eslint-disable-line no-invalid-this
  "resource://linkplaces/LinkplacesService.js");

window.LinkplacesPlaces = {

  get service() {
    return LinkplacesService;
  },

  get ctxMenu() {
    return document.getElementById("placesContext");
  },

  saveAllItems: function () {
    const triggerNode = this.ctxMenu.triggerNode;
    const nodesArray = PlacesUIUtils.getViewForNode(triggerNode).selectedNodes;
    const items = [];
    for (let node of nodesArray) { //eslint-disable-line prefer-const
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
