/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env commonjs */
/* global Components: false */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

// Bootstrap Addon Reason Constants:
// const APP_STARTUP = 1;
// const APP_SHUTDOWN = 2;
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
function startup(aData, aReason) { // eslint-disable-line no-unused-vars
}

/**
 * @param   {?}         aData
 * @param   {number}    aReason
 * @returns {void}
 */
function shutdown(aData, aReason) { // eslint-disable-line no-unused-vars
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
