import { unwrapOrFromUndefinable } from 'option-t/esm/Undefinable/unwrapOr';

import { WebExtSidebarActionService } from '../../typings/webext/sidebarAction';

import { Channel } from './Channel';
import {
    createOpenUrlAction,
    createRegisterUrlAction,
    WhereToOpenItem,
    RemoteAction,
} from './RemoteAction';

export function openItem(chan: Channel<RemoteAction>, bookmarkId: string, url: string, where: WhereToOpenItem): void {
    const a = createOpenUrlAction(bookmarkId, url, where);
    chan.postOneShotMessage(a);
}

export function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): void {
    // This method should be called by user interaction.
    sidebarAction.open().catch(console.error);
}

export function registerItem(chan: Channel<RemoteAction>, url: string, title?: string): void {
    const t = unwrapOrFromUndefinable(title, url);
    const a = createRegisterUrlAction(url, t);
    chan.postOneShotMessage(a);
}
