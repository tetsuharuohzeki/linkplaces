/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* @flow */

import { removeBookmarkItem } from './Bookmark';
import { BrowserMessagePort } from './BrowserMessagePort';
import { createContextMenu, removeContextMenu } from './ContextMenu';
import {
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_URL_RESULT,
    MSG_TYPE_ENABLE_WEBEXT_CTXMENU,
    MSG_TYPE_DISABLE_WEBEXT_CTXMENU,
    MSG_TYPE_OPEN_URL_FROM_POPUP,
} from './IpcMsg';
import { createTab } from './TabOpener';

/*global browser: false, console: false */
/* eslint-disable no-implicit-globals */

/*::
  import type { IpcMsg, OpenUrlMsg } from "./IpcMsg";
*/

BrowserMessagePort.create(browser, async (msg /* :IpcMsg<{| where: string; url: string; |}> */,
    sender /* :webext$runtime$MessageSender & webext$runtime$Port */) => {
    const { type, id, value } = msg;
    switch (type) {
        case MSG_TYPE_OPEN_URL: {
            const { url, where } = value;
            try {
                const res = await onMessageCreateTab(id, url, where);
                sender.postMessage(res);
            }
            catch (e) {
                console.error(e);
            }
            break;
        }
        case MSG_TYPE_ENABLE_WEBEXT_CTXMENU:
            createContextMenu();
            break;
        case MSG_TYPE_DISABLE_WEBEXT_CTXMENU:
            await removeContextMenu();
            break;
    }
});

browser.runtime.onConnect.addListener((s) => {
    console.log(s);
    s.onMessage.addListener(onMessageFromPopup);
    s.onDisconnect.addListener(function onDisconnect() {
        s.onDisconnect.removeListener(onDisconnect);
        s.onMessage.removeListener(onMessageFromPopup);
    });
});

async function onMessageCreateTab(msgId /* :number */, url /* :string */, where /* :string */) /* :Promise<IpcMsg<{| ok: boolean; tabId: ?number; error: ?string; |} | null>> */ {
    let value; // eslint-disable-line init-declarations

    try {
        const tabId = await createTab(url, where);
        value = {
            ok: true,
            tabId: tabId,
            error: null,
        };
    }
    catch (e) {
        value = {
            ok: false,
            tabId: null,
            error: e.message,
        };
    }

    const response = {
        id: msgId,
        type: MSG_TYPE_OPEN_URL_RESULT,
        value,
    };

    return response;
}

function onMessageFromPopup(msg) {
    const { type, value, } = msg;
    switch (type) {
        case MSG_TYPE_OPEN_URL_FROM_POPUP: {
            const { id, url } = value;
            openUrlFromPopup(url, id).catch(console.error);
            break;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

async function openUrlFromPopup(url, bookmarkId) {
    await createTab(url, 'tab');
    await removeBookmarkItem(bookmarkId);
}
