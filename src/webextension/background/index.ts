/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { removeBookmarkItem, } from './Bookmark';
import { createContextMenu } from './ContextMenu';
import {
    RemoteActionMsg,
    MSG_TYPE_OPEN_URL_FROM_POPUP,
    MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP,
} from './IpcMsg';
import { gClassicRuntimePort, openUrl } from './port';

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

function onMessageFromPopup(msg: RemoteActionMsg) {
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL_FROM_POPUP: {
            const { id, url } = msg.value;
            openUrlFromPopup(url, id).catch(console.error);
            break;
        }
        case MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP: {
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-xul-sidebar', null);
            break;
        }
        case MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP: {
            const { bookmarkId: id } = msg.value;
            gClassicRuntimePort.postOneShotMessage('linkplaces-open-folder-bookmark-in-library', {
                id,
            });
            break;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

async function openUrlFromPopup(url: string, bookmarkId: string): Promise<void> {
    await openUrl(url, 'tab');
    await removeBookmarkItem(bookmarkId);
}
