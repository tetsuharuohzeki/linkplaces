import type { WebExtSidebarActionService } from '../../typings/webext/sidebarAction';

import type { Channel } from './Channel';
import {
    createOpenUrlAction,
    WhereToOpenItem,
    OpenUrlAction,
} from './RemoteAction';

export function openItem(chan: Channel<OpenUrlAction>, bookmarkId: string, url: string, where: WhereToOpenItem): void {
    const a = createOpenUrlAction(bookmarkId, url, where);
    chan.postOneShotMessage(a);
}

export function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): void {
    // This method should be called by user interaction.
    sidebarAction.open().catch(console.error);
}
