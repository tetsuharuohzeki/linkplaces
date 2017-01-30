/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/*global browser: false */
/* eslint-disable no-implicit-globals */

const port = browser.runtime.connect({});
port.onMessage.addListener((msg) => {
  const { type, id, value } = msg;
  switch (type) {
    case "linkplaces-open-tab": {
      const { url, where } = value;
      const response = {
        id,
        type: "linkplaces-open-tab-result",
        value: null,
      };
      const creating = createTab(url, where);
      creating.then((tabId) => {
        response.value = {
          ok: true,
          tabId: tabId,
          error: null,
        };
        port.postMessage(response);
      }, (e) => {
        response.value = {
          ok: false,
          tabId: null,
          error: e.message,
        };
        port.postMessage(response);
      });
      break;
    }
  }
});

/**
 *  @param  {string}  url
 *  @param  {string}  where
 *  @returns  {number}
 *    `tabs.Tab.id`. integer.
 */
async function createTab(url, where) {
  const tabList = await browser.tabs.query({
    active: true,
    currentWindow: true,
    windowType: "normal",
  });
  if (tabList.length === 0) {
    throw new Error("assert!: don't get the current tab");
  }

  const currentTab = tabList[0];
  const currentId = currentTab.id;
  const option = {
    active: false,
    url,
    windowId: null,
  };

  switch (where) {
    case "current":
      return openInCurrent(currentId, url);
    case "save":
      // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads/download
      throw new RangeError("unimplemented!: where is `save`");
    case "window":
      return openInNewWindow(url);
    case "tab":
      option.active = true;
      break;
    case "tabshifted":
      break;
    default:
      throw new RangeError("unexpeced where type");
  }

  const newTab = await browser.tabs.create(option);
  return newTab.id;
}

async function openInCurrent(tabId, url) {
  browser.tabs.update(tabId, {
    url,
  });
  return tabId;
}

async function openInNewWindow(url) {
  const current = await browser.windows.getCurrent({
    windowTypes: ["normal"],
  });

  const window = await browser.windows.create({
    url,
    // XXX: Firefox has not supported yet.
    // focused: true,
    type: "normal",
    state: "normal",
    incognito: current.incognito,
  });
  const tab = window.tabs[0];
  return tab.id;
}
