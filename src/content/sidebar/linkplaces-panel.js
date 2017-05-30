/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env browser */
/* global Components: false */

// XXX: to avoid the error sourceType is not module.
"use strict"; // eslint-disable-line strict, lines-around-directive

const { LinkplacesPanel } = Components.utils.import("chrome://linkplaces/content/sidebar/LinkplacesPanel.js", {});
window.gLinkplacesPanel = new LinkplacesPanel(window);
