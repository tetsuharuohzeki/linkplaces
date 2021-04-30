import { removeBookmarkItem, getLinkSchemeType, createBookmarkItem } from '../shared/Bookmark';
import type { Packet } from '../shared/Channel';
import { NoImplementationError } from '../shared/NoImplementationError';
import {
    RemoteAction,
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_REGISTER_URL,
    WhereToOpenItem,
} from '../shared/RemoteAction';

import { createContextMenu } from './ContextMenu';
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

function onMessageFromPopup(packet: Packet<RemoteAction>): void {
    const { payload: msg } = packet;
    handleRemoteAction(msg);
}

function handleRemoteAction(msg: RemoteAction): void {
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL: {
            const { id, url, where } = msg.value;
            openUrlFromPopup(url, id, where).catch(console.error);
            break;
        }
        case MSG_TYPE_REGISTER_URL: {
            const { url, title } = msg.value;
            createBookmarkItem(url, title).catch(console.error);
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
