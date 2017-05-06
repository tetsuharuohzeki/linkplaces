/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* @flow */
/*global browser: false, console:false */

const CTXMENU_ID_TAB_SAVE_TAB = "linkplaces-ctx-tab-save-tab";
const CTXMENU_ID_CONTENT_SAVE_TAB = "linkplaces-ctx-content-save-tab";
const CTXMENU_ID_LINK_SAVE_LINK = "linkplaces-ctx-link-save-link";

export function createContextMenu() {
  const list = [
    {
      type: "normal",
      id: CTXMENU_ID_TAB_SAVE_TAB,
      title: "Add Tab to LinkPlaces",
      contexts: ["tab"],
    },
    {
      type: "normal",
      id: CTXMENU_ID_CONTENT_SAVE_TAB,
      title: "Add Page to LinkPlaces",
      contexts: ["page"],
    },
    {
      type: "normal",
      id: CTXMENU_ID_LINK_SAVE_LINK,
      title: "Add Link to LinkPlaces",
      contexts: ["link"],
    },
  ];

  for (const item of list) {
    browser.contextMenus.create(item);
  }

  browser.contextMenus.onClicked.addListener(onClicked);
}

export function removeContextMenu() {
  browser.contextMenus.onClicked.removeListener(onClicked);

  return browser.contextMenus.removeAll();
}

function onClicked(info /* :webext$contextMenusInternal$OnClickData */, tab /* :?webext$tabs$Tab */) {
  switch (info.menuItemId) {
    case CTXMENU_ID_TAB_SAVE_TAB:
      if (!tab) {
        throw new TypeError();
      }
      console.log(tab.url);
      break;
    case CTXMENU_ID_CONTENT_SAVE_TAB:
      console.log(info.pageUrl);
      break;
    case CTXMENU_ID_LINK_SAVE_LINK:
      console.log(info.linkUrl);
      break;
    default:
      throw new RangeError("unexpected `info.menuItemId`");
  }
}
