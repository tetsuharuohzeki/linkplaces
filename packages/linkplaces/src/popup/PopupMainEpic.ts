import {
    WhereToOpenItem,
    openItemOneshot as openItemViaChannel,
    openWebExtSidebar as openWebExtSidebarDirect,
} from '@linkplaces/ipc_message';
import { browser, type BookmarkId } from '@linkplaces/webext_types';

import type { PopupPlainReduxStore } from './PopupMainStore.js';
import type { RemoteActionChannel } from './PopupMessageChannel.js';

export class PopupMainEpic {
    private _channel: RemoteActionChannel;

    constructor(channel: RemoteActionChannel, _store: PopupPlainReduxStore) {
        this._channel = channel;
    }

    async openItem(id: BookmarkId, url: string): Promise<void> {
        const where: WhereToOpenItem = WhereToOpenItem.Tab;
        openItemViaChannel(this._channel, id, url, where);
        return closeWindow();
    }

    // eslint-disable-next-line class-methods-use-this
    async openWebExtSidebar(): Promise<void> {
        // These funcs should be called by user interaction.
        const sidebarOpen = openWebExtSidebarDirect(browser.sidebarAction);
        const closingPopup = closeWindow();
        await Promise.all([sidebarOpen, closingPopup]);
    }
}

async function closeWindow(): Promise<void> {
    await sleepWithTimeout(0);
    window.close();
}

function sleepWithTimeout(millisec: number): Promise<void> {
    const p = new Promise<void>((resolve) => window.setTimeout(resolve, millisec));
    return p;
}
