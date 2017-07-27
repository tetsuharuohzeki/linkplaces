/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  initializeService,
  destroyService,
} from "./content/boot/setup.js";
import {
  initializeUIForEachChromeWindow,
  destroyUIForEachChromeWindow,
} from "./content/boot/window.js";

// https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Embedded_WebExtensions

// Bootstrap Addon Reason Constants:
// const APP_STARTUP = 1;
const APP_SHUTDOWN = 2;
// const ADDON_ENABLE = 3;
// const ADDON_DISABLE = 4;
// const ADDON_INSTALL = 5;
// const ADDON_UNINSTALL = 6;
// const ADDON_UPGRADE = 7;
// const ADDON_DOWNGRADE = 8;

/**
 * bootstrapped addon interfaces
 *
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
this.startup = function startup({ webExtension }, aReason) { // eslint-disable-line no-unused-vars, no-invalid-this
  webExtension.startup().then(({browser}) => {
    initializeService(browser);
    initializeUIForEachChromeWindow();
  });
};

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
this.shutdown = function shutdown(aData, aReason) { // eslint-disable-line no-unused-vars, no-invalid-this
};

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
this.install = function install(aData, aReason) { // eslint-disable-line no-unused-vars, no-invalid-this
};

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
this.uninstall = function uninstall(aData, aReason) { // eslint-disable-line no-unused-vars, no-invalid-this
  if (aReason === APP_SHUTDOWN) {
    return;
  }

  destroyUIForEachChromeWindow();
  destroyService();
};
