/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Cu, } from "../service/chrome.js";
import { LinkplacesService } from "../service/LinkplacesService.js";
import { LinkplacesChrome } from "../ui/LinkplacesChrome.js";

const SIDEBAR_MOD_NAME = "chrome://linkplaces/content/sidebar/LinkplacesSidebarContent.js";

const windowMap = new WeakMap();

/**
 * @param {Window} aDomWindow
 * @returns {void}
 */
export function setupBrowserWindow(aDomWindow) {
  const windowType = aDomWindow.document.
    documentElement.getAttribute("windowtype");
  // If this isn't a browser window then abort setup.
  if (windowType !== "navigator:browser") {
    return;
  }

  const handler = LinkplacesChrome.create(aDomWindow, LinkplacesService);
  windowMap.set(aDomWindow, handler);
}

/**
 * @param {Window} aDomWindow
 * @returns {void}
 */
export function teardownBrowserWindow(aDomWindow) {
  const handler = windowMap.get(aDomWindow);
  windowMap.delete(aDomWindow);

  handler.destroy();
}

export function initializeService(browser) {
  LinkplacesService.init(browser);
  Cu.import(SIDEBAR_MOD_NAME);
}

export function destroyService() {
  Cu.unload(SIDEBAR_MOD_NAME);
  LinkplacesService.destroy();
}
