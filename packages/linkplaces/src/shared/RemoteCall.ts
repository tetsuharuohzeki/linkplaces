import { unwrapOrFromUndefinable } from 'option-t/esm/Undefinable/unwrapOr';

import type { WebExtSidebarActionService } from '../../typings/webext/sidebarAction';

import {
    createOpenUrlAction,
    createRegisterUrlAction,
    WhereToOpenItem,
    RemoteAction,
} from './RemoteAction';
import type { ClientConnection } from './RemoteActionChannel';

export function openItem(chan: ClientConnection<RemoteAction>, bookmarkId: string, url: string, where: WhereToOpenItem): void {
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
