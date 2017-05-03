/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* @flow */

import { createTab } from "./TabOpener";

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
