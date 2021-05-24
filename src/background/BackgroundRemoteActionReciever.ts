import { createOk, Result } from 'option-t/esm/PlainResult';
import { createBookmarkItem, getLinkSchemeType, removeBookmarkItem } from '../shared/Bookmark';
import { NoImplementationError } from '../shared/NoImplementationError';
import { MSG_TYPE_OPEN_URL, MSG_TYPE_REGISTER_URL, RemoteAction, WhereToOpenItem } from '../shared/RemoteAction';
import type { TowerService } from '../shared/tower_like_ipc/traits';

import { createTab } from './TabOpener';

export class BackgroundRemoteActionReciever implements TowerService<RemoteAction, void> {
    async ready(): Promise<Result<void, Error>> {
        return createOk(undefined);
    }

    async call(msg: RemoteAction): Promise<void> {
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
