/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* @flow */

"use strict";

/*global browser: false, console: false */
/* eslint-disable no-implicit-globals */

/*::
  type IPCMsg<T> = {|
    id: number;
    type: string;
    value: T;
  |};
*/

const port = browser.runtime.connect("");
port.onMessage.addListener((msg /* :IPCMsg<{| where: string; url: string; |}> */) => {
  const { type, id, value } = msg;
  switch (type) {
    case "linkplaces-open-tab": {
      const { url, where } = value;
      onMessageCreateTab(id, url, where).then((response) => {
        port.postMessage(response);
      }, (err) => console.error(err));
      break;
    }
  }
});

/**
 *  @param  {number}  msgId
 *  @param  {string}  url
 *  @param  {string}  where
 *  @returns  {!Promise<{ ok: boolean, tabId: ?number, error: ?string, }>}
 */
async function onMessageCreateTab(msgId /* :number */, url /* :string */, where /* :string */) /* :Promise<IPCMsg<{| ok: boolean; tabId: ?number; error: ?string; |} | null>> */ {
  const response /* :IPCMsg<{| ok: boolean; tabId: ?number; error: ?string; |} | null> */ = {
    id: msgId,
    type: "linkplaces-open-tab-result",
    value: null,
  };

  try {
    const tabId = await createTab(url, where);
    response.value = {
      ok: true,
      tabId: tabId,
      error: null,
    };
  }
  catch (e) {
    response.value = {
      ok: false,
      tabId: null,
      error: e.message,
    };
  }

  return response;
}

/**
 *  @param  {string}  url
 *  @param  {string}  where
 *  @returns  {number}
 *    `tabs.Tab.id`. integer.
 */
async function createTab(url /* :string */, where /* :string */) /* :Promise<number> */ {
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
  if (currentId === undefined || currentId === null) {
    throw new TypeError("currentId should not null");
  }

  const option = {
    active: false,
    url,
    windowId: undefined,
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
  const id = newTab.id;
  if (id === undefined || id === null) {
    throw new TypeError("id should not null");
  }

  return id;
}

async function openInCurrent(tabId /* :number */, url /* :string */) /*: Promise<number> */ {
  browser.tabs.update(tabId, {
    url,
  });
  return tabId;
}

async function openInNewWindow(url /* :string */) /* :Promise<number> */ {
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
  const tabs /* :?Array<webext$tabs$Tab> */ = window.tabs;
  if (!tabs) {
    throw new TypeError("window.tabs should not be null");
  }

  const tab = tabs[0];
  if (!tab) {
    throw new TypeError("window.tabs[0] would be the current tab");
  }

  const id = tab.id;
  if (id === undefined || id === null) {
    throw new TypeError("id should not null");
  }

  return id;
}
