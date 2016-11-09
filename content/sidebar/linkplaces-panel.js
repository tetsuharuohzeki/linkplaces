/* vim: set filetype=javascript shiftwidth=2 tabstop=2 expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
/* global Components: false */

"use strict";

const { LinkplacesPanel } = Components.utils.import("chrome://linkplaces/content/sidebar/LinkplacesPanel.js", {});
window.gLinkplacesPanel = new LinkplacesPanel(window);
