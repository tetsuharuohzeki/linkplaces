/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { removeBookmarkItem, getLinkSchemeType } from './Bookmark';
import { BrowserMessagePort } from './BrowserMessagePort';
import { createContextMenu, removeContextMenu } from './ContextMenu';
import {
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_URL_RESULT,
    MSG_TYPE_ENABLE_WEBEXT_CTXMENU,
    MSG_TYPE_DISABLE_WEBEXT_CTXMENU,
    MSG_TYPE_OPEN_URL_FROM_POPUP,
    MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP,
} from './IpcMsg';
import { createTab, openBookmarklet } from './TabOpener';

/*global browser: false, console: false */
/* eslint-disable no-implicit-globals */

/*::
  import type { IpcMsg, OpenUrlMsg } from "./IpcMsg";
*/

// @ts-ignore
const gClassicRuntimePort = BrowserMessagePort.create(browser, async (msg /* :IpcMsg<{| where: string; url: string; |}> */,
    // @ts-ignore
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
    s.onMessage.addListener(onMessageFromPopup);
    // @ts-ignore
    s.onDisconnect.addListener(function onDisconnect() {
        // @ts-ignore
        s.onDisconnect.removeListener(onDisconnect);
        // @ts-ignore
        s.onMessage.removeListener(onMessageFromPopup);
    });
});

// @ts-ignore
async function onMessageCreateTab(msgId /* :number */, url /* :string */, where /* :string */) /* :Promise<IpcMsg<{| ok: boolean; tabId: ?number; error: ?string; |} | null>> */ {
    const { isPrivileged, type } = getLinkSchemeType(url);
    if (isPrivileged && type !== 'javascript') {
        throw new URIError(`it should not be sent to here: ${url}`);
    }

    let value; // eslint-disable-line init-declarations
    try {
        let tabId; // eslint-disable-line init-declarations

        if (isPrivileged) {
            tabId = await openBookmarklet(url);
        }
        else {
            tabId = await createTab(url, where);
        }

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

// @ts-ignore
function onMessageFromPopup(msg) {
    const { type, value, } = msg;
    switch (type) {
        case MSG_TYPE_OPEN_URL_FROM_POPUP: {
            const { id, url } = value;
            openUrlFromPopup(url, id).catch(console.error);
            break;
        }
        case MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP: {
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-xul-sidebar', null);
            break;
        }
        case MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP: {
            const { bookmarkId: id } = value;
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-folder-bookmark-in-library', {
                id,
            });
            break;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

// @ts-ignore
async function openUrlFromPopup(url, bookmarkId) {
    const schemeType = getLinkSchemeType(url);
    if (schemeType.isPrivileged) {
        if (schemeType.type === 'javascript') {
            await openBookmarklet(url);
        }
        else {
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-privileged-url', {
                url,
            });
        }
    }
    else {
        await createTab(url, 'tab');
    }

    await removeBookmarkItem(bookmarkId);
}
