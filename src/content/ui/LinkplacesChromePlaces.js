/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const ID_PLACES_CTX_MENU = "placesContext";
const ID_CTX_SAVE_ITEMS = "linkplaces-placesCtx-saveItems";

class ContextMenuItem {
  constructor(win, param) {
    this._dom = null;
    this._onCommand = null;

    Object.seal(this);
    this._init(win, param);
  }

  destroy() {
    this._finalize();

    this._onCommand = null;
    this._dom = null;
  }

  _init(win, { id, label, onCommand, mountpoint, attr}) {
    const dom = win.document.createElement("menuitem");
    dom.setAttribute("id", id);
    dom.setAttribute("label", label);
    dom.addEventListener("command", this, false);

    if (!!attr) {
      for (let [key, value] of attr.entries()) { //eslint-disable-line prefer-const
        dom.setAttribute(key, value);
      }
    }

    this._dom = dom;
    this._onCommand = onCommand;

    const mp = win.document.querySelector(mountpoint);
    mp.parentNode.insertBefore(dom, mp);
  }

  _finalize() {
    this._dom.remove();
    this._dom.removeEventListener("command", this, false);
  }

  handleEvent(event) {
    switch (event.type) {
      case "command":
        this._onCommand(event);
        break;
    }
  }

  finalize() {
    this._dom.remove();

    this._dom.removeEventListener("command", this, false);
    this._onCommand = null;
    this._dom = null;
  }

  onCommand() {
    this._onCommand();
  }
}

export class LinkplacesChromePlaces {

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
