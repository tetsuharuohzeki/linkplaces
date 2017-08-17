import { WebExtSidebarActionService } from '../../../typings/webext/sidebarAction';

import { Channel } from './Channel';
import {
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW,
    MSG_TYPE_OPEN_SIDEBAR,
} from './RemoteAction';

export function openItem(chan: Channel, bookmarkId: string, url: string): void {
    chan.postOneShotMessage(MSG_TYPE_OPEN_URL, { id: bookmarkId, url });
}

export function openClassicSidebar(chan: Channel): void {
    chan.postOneShotMessage(MSG_TYPE_OPEN_SIDEBAR, null);
}

export function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): void {
    // This method should be called by user interaction.
    sidebarAction.open().catch(console.error);
}

export function openPlacesOrganizeWindow(chan: Channel, bookmarkId: string): void {
    chan.postOneShotMessage(MSG_TYPE_OPEN_ORGANIZE_WINDOW, {
        bookmarkId,
    });
}

