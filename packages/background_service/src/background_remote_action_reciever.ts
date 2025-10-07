import { NoImplementationError } from '@linkplaces/foundation';
import {
    type WhereToOpenItem,
    type RemoteAction,
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_REGISTER_URL,
} from '@linkplaces/ipc_message';
import { createBookmarkItem, getLinkSchemeType, removeBookmarkItem } from '@linkplaces/shared/bookmark';
import type { BookmarkId } from '@linkplaces/webext_types';

import { createTab } from './tab_opener.js';

export async function callBackgroundRemoteActionReciever(msg: RemoteAction): Promise<void> {
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL: {
            const { id, url, where } = msg.value;
            await openUrlFromPopup(url, id, where);
            return;
        }
        case MSG_TYPE_REGISTER_URL: {
            const { url, title } = msg.value;
            await createBookmarkItem(url, title);
            return;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

async function openUrlFromPopup(url: string, bookmarkId: BookmarkId, where: WhereToOpenItem): Promise<void> {
    await openUrl(url, where);
    await removeBookmarkItem(bookmarkId);
}

async function openUrl(url: string, where: WhereToOpenItem): Promise<number> {
    const { isPrivileged } = getLinkSchemeType(url);
    if (isPrivileged) {
        const e = new NoImplementationError('opening a privileged url');
        throw e;
    }

    const opened = createTab(url, where);
    return opened;
}
