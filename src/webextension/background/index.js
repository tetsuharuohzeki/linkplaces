/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { removeBookmarkItem, getLinkSchemeType, useClassicBookmarkBackend } from './Bookmark';
import {
    MSG_TYPE_OPEN_URL_FROM_POPUP,
    MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP,
} from './IpcMsg';
import { gClassicRuntimePort } from './port';
import { createTab, openBookmarklet } from './TabOpener';

/*global browser: false, console: false */
/* eslint-disable no-implicit-globals */

/*::
  import type { IpcMsg, OpenUrlMsg } from "./IpcMsg";
*/

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

    if (useClassicBookmarkBackend) {
        gClassicRuntimePort.postOneShotMessage('linkplaces-classic-remove-item', {
            id: bookmarkId,
        });
    }
    else {
        await removeBookmarkItem(bookmarkId);
    }
}
