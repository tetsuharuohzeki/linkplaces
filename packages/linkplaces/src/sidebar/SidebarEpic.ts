import {
    type WhereToOpenItem,
    openItem as openItemViaChannel,
    registerItem as registerItemViaChannel,
} from '@linkplaces/ipc_message';

import type { RemoteActionChannel } from './SidebarMessageChannel';
import type { SidebarPlainReduxStore } from './SidebarStore';

export class SidebarEpic {
    private _channel: RemoteActionChannel;

    constructor(channel: RemoteActionChannel, _store: SidebarPlainReduxStore) {
        this._channel = channel;
    }

    openItem(id: string, url: string, where: WhereToOpenItem): void {
        openItemViaChannel(this._channel, id, url, where);
    }

    pasteItemFromClipboardActionActual(event: ClipboardEvent): void {
        const data = event.clipboardData;
        if (!data) {
            return;
        }

        const url = data.getData('text/plain');

        registerItemViaChannel(this._channel, url);
    }
}
