/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { removeBookmarkItem, getLinkSchemeType, } from '../shared/Bookmark';
import type { Packet } from '../shared/Channel';
import { NoImplementationError } from '../shared/NoImplementationError';
import {
    RemoteAction,
    MSG_TYPE_OPEN_URL,
    WhereToOpenItem,
} from '../shared/RemoteAction';

import { createContextMenu } from './ContextMenu';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { createTab } from './TabOpener';

(function main() {

    createContextMenu();

    browser.runtime.onConnect.addListener((s) => {
        s.onMessage.addListener(onMessageFromPopup);
        s.onDisconnect.addListener(function onDisconnect() {
            s.onDisconnect.removeListener(onDisconnect);
            s.onMessage.removeListener(onMessageFromPopup);
        });
    });
})();

function onMessageFromPopup(packet: Packet<RemoteAction>) {
    const { payload: msg } = packet;
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL: {
            const { id, url, where } = msg.value;
            openUrlFromPopup(url, id, where).catch(console.error);
            break;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

async function openUrlFromPopup(url: string, bookmarkId: string, where: WhereToOpenItem): Promise<void> {
    await openUrl(url, where);
    await removeBookmarkItem(bookmarkId);
}

function openUrl(url: string, where: WhereToOpenItem): Promise<number> {
    const { isPrivileged } = getLinkSchemeType(url);
    let opened = null;
    if (isPrivileged) {
        const e = new NoImplementationError('opening a privileged url');
        opened = Promise.reject(e);
    }
    else {
        opened = createTab(url, where);
    }

    return opened;
}
