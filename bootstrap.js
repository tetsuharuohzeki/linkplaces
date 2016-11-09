/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env commonjs */
/* global Components: false */

"use strict";

const { interfaces: Ci, utils: Cu } = Components;
const { require } = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {});
const { LinkplacesChrome } = require("chrome://linkplaces/content/LinkplacesChrome.js");

// Bootstrap Addon Reason Constants:
// const APP_STARTUP = 1;
const APP_SHUTDOWN = 2;
// const ADDON_ENABLE = 3;
// const ADDON_DISABLE = 4;
// const ADDON_INSTALL = 5;
// const ADDON_UNINSTALL = 6;
// const ADDON_UPGRADE = 7;
// const ADDON_DOWNGRADE = 8;

const {Services} = Cu.import("resource://gre/modules/Services.jsm", {});

const windowMap = new WeakMap();
let gLinkplacesService = null;
let gCreateWidget = null;
let gDestroyWidget = null;

const SetupHelper = {
  /**
   * @param {Window} aDomWindow
   * @returns {void}
   */
  setup(aDomWindow) {
    const windowType = aDomWindow.document.
                     documentElement.getAttribute("windowtype");
    // If this isn't a browser window then abort setup.
    if (windowType !== "navigator:browser") {
      return;
    }

    const handler = LinkplacesChrome.create(aDomWindow, gLinkplacesService);
    windowMap.set(aDomWindow, handler);
  },

  /**
   * @param {Window} aDomWindow
   * @returns {void}
   */
  teardown(aDomWindow) {
    const handler = windowMap.get(aDomWindow);
    windowMap.delete(aDomWindow);

    handler.destroy();
  },
};

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
    domWindow.addEventListener("DOMContentLoaded", function onLoad(/* aEvent */) {
      domWindow.removeEventListener("DOMContentLoaded", onLoad, false);
      SetupHelper.setup(domWindow);
    }, false);
  },

  onCloseWindow(/*aXulWindow*/) {}, // eslint-disable-line no-empty-function

  onWindowTitleChange(/*aWindow, aNewTitle*/) {}, // eslint-disable-line no-empty-function
};


/**
 * bootstrapped addon interfaces
 *
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
function startup(aData, aReason) { // eslint-disable-line no-unused-vars
  // Defer loading modules registered by this package.
  const { LinkplacesService } = Cu.import("chrome://linkplaces/content/LinkplacesService.js", {});
  gLinkplacesService = LinkplacesService;
  const { createWidget, destroyWidget, } = Cu.import("chrome://linkplaces/content/LinkplacesUIWidget.js", {});
  gCreateWidget = createWidget;
  gDestroyWidget = destroyWidget;

  Services.wm.addListener(WindowListener);

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
    SetupHelper.setup(domWindow);
  }

  gCreateWidget();
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
function shutdown(aData, aReason) { // eslint-disable-line no-unused-vars
  // if the application is shutdown time, we don't have to call these step.
  if (aReason === APP_SHUTDOWN) {
    return;
  }

  Services.wm.removeListener(WindowListener);

  gDestroyWidget();

  const windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    const domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow); // eslint-disable-line new-cap
    SetupHelper.teardown(domWindow);
  }

  Cu.unload("chrome://linkplaces/content/LinkplacesUIWidget.js");
  Cu.unload("chrome://linkplaces/content/LinkplacesService.js");
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
function install(aData, aReason) { // eslint-disable-line no-unused-vars
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
function uninstall(aData, aReason) { // eslint-disable-line no-unused-vars
}
