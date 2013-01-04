/* vim: set filetype=javascript shiftwidth=2 tabstop=2 noexpandtab: */

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "LinkplacesService",
                                  "resource://linkplaces/LinkplacesService.jsm");

var LinkplacesPlaces = {

  get service () {
    return LinkplacesService;
  },

  get ctxMenu () {
    return document.getElementById("placesContext");
  },

  handleEvent: function (aEvent) {
    switch (aEvent.type) {
      case "load":
        this.onLoad();
        break;
      case "unload":
        this.onUnLoad();
        break;
    }
  },

  onLoad: function () {
    window.removeEventListener("load", this, false);

    window.addEventListener("unload",  this, false);
  },

  onUnLoad: function () {
    window.removeEventListener("unload", this, false);

    this.ctxMenu = null;
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
window.addEventListener("load", LinkplacesPlaces, false);
