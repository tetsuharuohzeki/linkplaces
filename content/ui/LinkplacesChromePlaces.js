/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

const ID_PLACES_CTX_MENU = "placesContext";
const ID_CTX_SAVE_ITEMS = "linkplaces-placesCtx-saveItems";

const { ContextMenuItem } = require("./contextmenu");

class LinkplacesChromePlaces {

  static create(win, service) {
    const obj = new LinkplacesChromePlaces(win, service);
    return obj;
  }

  constructor(win, service) {
    this._win = win;
    this._service = service;
    this._saveItems = null;
    win.gLinkplacesChromePlaces = this; // eslint-disable-line no-param-reassign

    Object.seal(this);
    this._init();
  }

  destroy() {
    this._finalize();

    this._win.gLinkplacesChromePlaces = null;
    this._saveItems = null;
    this._service = null;
    this._win = null;
  }

  _init() {
    this._saveItems = new ContextMenuItem(this._win, {
      id: ID_CTX_SAVE_ITEMS,
      label: this._service.stringBundle.GetStringFromName("linkplaces.ctx.places.saveItems"), // eslint-disable-line new-cap
      onCommand: () => {
        this.saveAllItems();
      },
      mountpoint: "#placesContext_cut + menuitem",
      attr: new Map([
        ["selection", "link"],
        ["forcehideselection", "bookmark"],
      ]),
    });

    this._win.addEventListener("unload", this, false);
  }

  _finalize() {
    this._saveItems.destroy();
  }

  saveAllItems() {
    const window = this._win;
    const PlacesUtils = this._win.PlacesUtils;
    const PlacesUIUtils = this._win.PlacesUIUtils;

    const ctxMenu = window.document.getElementById(ID_PLACES_CTX_MENU);
    const triggerNode = ctxMenu.triggerNode;
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
    this._service.saveItems(items);
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
}

module.exports = Object.freeze({
  LinkplacesChromePlaces,
});
