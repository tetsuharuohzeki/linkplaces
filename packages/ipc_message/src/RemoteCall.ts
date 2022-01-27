import type { BookmarkId, WebExtSidebarActionService } from '@linkplaces/webext_types';
import { unwrapOrFromUndefinable } from 'option-t/Undefinable/unwrapOr';

import {
    createOpenUrlAction,
    createRegisterUrlAction,
    WhereToOpenItem,
    RemoteAction,
} from './RemoteAction.js';
import type { ClientConnection } from './RemoteActionChannel.js';

export function openItem(chan: ClientConnection<RemoteAction>, bookmarkId: BookmarkId, url: string, where: WhereToOpenItem): void {
    const a = createOpenUrlAction(bookmarkId, url, where);
    chan.postOneShotMessage(a);
}

export function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): void {
    // This method should be called by user interaction.
    sidebarAction.open().catch(console.error);
}

export function registerItem(chan: ClientConnection<RemoteAction>, url: string, title?: string): void {
    const t = unwrapOrFromUndefinable(title, url);
    const a = createRegisterUrlAction(url, t);
    chan.postOneShotMessage(a);
}
