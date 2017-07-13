/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { removeBookmarkItem, } from './Bookmark';
import { createContextMenu } from './ContextMenu';
import {
    MSG_TYPE_OPEN_URL_FROM_POPUP,
    MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP,
} from './IpcMsg';
import { gClassicRuntimePort, openUrl } from './port';

/*global browser: false, console: false */
/* eslint-disable no-implicit-globals */

/*::
  import type { IpcMsg, OpenUrlMsg } from "./IpcMsg";
*/

(function main() {

    createContextMenu();

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
})();

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

/**
 * @param {string} url
 * @param {string} bookmarkId
 * @return  {Promise<void>}
 */
async function openUrlFromPopup(url, bookmarkId) {
    await openUrl(url, 'tab');
    await removeBookmarkItem(bookmarkId);
}
