/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env commonjs */

"use strict"; // eslint-disable-line strict

import {
  setupBrowserWindow,
  teardownBrowserWindow,
  initializeService,
  destroyService,
} from "./content/boot/setup.js";

import { Ci, Cu, } from "./content/service/chrome";

const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
const webext = require("sdk/webextension");

// nsIWindowMediatorListener
const WindowListener = {

  /**
   * @param {Window} aXulWindow
   * @returns {void}
   */
  onOpenWindow(aXulWindow) {
    const domWindow = aXulWindow.QueryInterface(Ci.nsIInterfaceRequestor) // eslint-disable-line new-cap
      .getInterface(Ci.nsIDOMWindow);

    // Wait finish loading
    // Use `DOMContentLoaded` to avoid the error.
    // see https://blog.mozilla.org/addons/2014/03/06/australis-for-add-on-developers-2/
    domWindow.addEventListener("DOMContentLoaded", function onLoad(aEvent) {
      const w = aEvent.currentTarget;
      w.removeEventListener("DOMContentLoaded", onLoad, false);
      setupBrowserWindow(w);
    }, false);
  },

  onCloseWindow(/*aXulWindow*/) {}, // eslint-disable-line no-empty-function

  onWindowTitleChange(/*aWindow, aNewTitle*/) {}, // eslint-disable-line no-empty-function
};

/**
 *  https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Listening_for_load_and_unload
 *
 *  @param  { { loadReason: string, } } options
 *  @param  {Function}  callbacks
 *  @return {void}
 *
 */
exports.main = function (options, callbacks) { // eslint-disable-line no-unused-vars
  webext.startup().then(({browser}) => {
    initializeService(browser);

    Services.wm.addListener(WindowListener);

    const windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements()) {
      const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
      setupBrowserWindow(domWindow);
    }
  });
};

/**
 *  https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Listening_for_load_and_unload
 *
 *  @param  {string}  reason
 *  @return {void}
 */
exports.onUnload = function (reason) { // eslint-disable-line no-unused-vars
  // if the application is shutdown time, we don't have to call these step.
  if (reason === "shutdown") {
    return;
  }

  Services.wm.removeListener(WindowListener);

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
    teardownBrowserWindow(domWindow);
  }

  destroyService();
};
