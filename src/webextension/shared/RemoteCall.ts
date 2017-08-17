import { WebExtSidebarActionService } from '../../../typings/webext/sidebarAction';

import { Channel } from './Channel';
import {
    createOpenUrlAction,
    createOpenClassicSidebarAction,
    createOpenClassicPlacesOrganizerAction,
} from './RemoteAction';

export function openItem(chan: Channel, bookmarkId: string, url: string): void {
    const a = createOpenUrlAction(bookmarkId, url);
    chan.postOneShotMessage(a);
}

export function openClassicSidebar(chan: Channel): void {
    const a = createOpenClassicSidebarAction();
    chan.postOneShotMessage(a);
}

export function openWebExtSidebar(sidebarAction: WebExtSidebarActionService): void {
    // This method should be called by user interaction.
    sidebarAction.open().catch(console.error);
}

export function openPlacesOrganizeWindow(chan: Channel, bookmarkId: string): void {
    const a = createOpenClassicPlacesOrganizerAction(bookmarkId);
    chan.postOneShotMessage(a);
}

