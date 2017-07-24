/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env commonjs */

"use strict"; // eslint-disable-line strict

import {
  initializeService,
  destroyService,
} from "./content/boot/setup.js";
import {
  initializeUIForEachChromeWindow,
  destroyUIForEachChromeWindow,
} from "./content/boot/window.js";

const webext = require("sdk/webextension");

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
    initializeUIForEachChromeWindow();
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

  destroyUIForEachChromeWindow();
  destroyService();
};
