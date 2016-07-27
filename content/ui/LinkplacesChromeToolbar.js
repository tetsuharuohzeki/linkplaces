/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-env commonjs */
"use strict";

const { Ci } = require("chrome");
const { SIDEBAR_BROADCAST_ID } = require("./LinkplacesChromeSidebar.js");

const DOM_ID_TOOLBAR_BUTTON = "linkplaces-button";

class LinkplacesChromeToolbar {

  constructor(win, service) {
    this._win = win;
    this._service = service;

    Object.seal(this);
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

  // based on bookmarksButtonObserver class and browserDragAndDrop class
  OnDrop(aEvent) {
    const service = this._service;
    const ip = new this._win.InsertionPoint(service.folder,
                                service.DEFAULT_INDEX,
                                Ci.nsITreeView.DROP_ON);
    this._win.PlacesControllerDragHelper.onDrop(ip, aEvent.dataTransfer);
  }

  OnDragOver(aEvent) {
    this._win.browserDragAndDrop.dragOver(aEvent);
    aEvent.dropEffect = "link"; // eslint-disable-line no-param-reassign
  }

  OnDragExit(/* aEvent */) {
    // noop
  }
}

function createToolbarButton(window, service) {
  const dom = window.document.createElement("toolbarbutton");
  dom.setAttribute("id", DOM_ID_TOOLBAR_BUTTON);
  dom.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
  const tooltip = service.stringBundle.GetStringFromName("linkplaces.chrome.button.tooltip"); // eslint-disable-line new-cap
  dom.setAttribute("tooltiptext", tooltip);
  dom.setAttribute("observes", SIDEBAR_BROADCAST_ID);
  dom.setAttribute("ondrop", "gLinkplacesBrowserUI.toolbarToggleButton().OnDrop(event)");
  dom.setAttribute("ondragover", "gLinkplacesBrowserUI.toolbarToggleButton().OnDragOver(event)");
  dom.setAttribute("ondragenter", "gLinkplacesBrowserUI.toolbarToggleButton().OnDragOver(event)");
  dom.setAttribute("ondragexit", "gLinkplacesBrowserUI.toolbarToggleButton().OnDragExit(event)");
  return dom;
}

module.exports = Object.freeze({
  LinkplacesChromeToolbar,
  createToolbarButton,
  DOM_ID_TOOLBAR_BUTTON,
});
