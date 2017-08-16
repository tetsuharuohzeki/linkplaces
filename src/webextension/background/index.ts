/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { removeBookmarkItem, } from './Bookmark';
import { createContextMenu } from './ContextMenu';
import {
    RemoteAction,
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_SIDEBAR,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW,
} from '../shared/RemoteAction';
import {
    IPC_MSG_TYPE_CLASSIC_OPEN_FOLDER_IN_LIBRARY,
    IPC_MSG_TYPE_OPEN_CLASSIC_SIDEBAR,
} from './OverIpcAction';
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

function onMessageFromPopup(msg: RemoteAction) {
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL: {
            const { id, url } = msg.value;
            openUrlFromPopup(url, id).catch(console.error);
            break;
        }
        case MSG_TYPE_OPEN_SIDEBAR: {
            gClassicRuntimePort.postOneShotMessage(IPC_MSG_TYPE_OPEN_CLASSIC_SIDEBAR, null);
            break;
        }
        case MSG_TYPE_OPEN_ORGANIZE_WINDOW: {
            const { bookmarkId: id } = msg.value;
            gClassicRuntimePort.postOneShotMessage(IPC_MSG_TYPE_CLASSIC_OPEN_FOLDER_IN_LIBRARY, {
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
