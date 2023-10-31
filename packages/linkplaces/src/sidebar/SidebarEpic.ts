import {
    type WhereToOpenItem,
    openItem as openItemViaChannel,
    registerItem as registerItemViaChannel,
} from '@linkplaces/ipc_message';
import type { BookmarkId } from '@linkplaces/webext_types';

import { isNotNull } from 'option-t/esm/Nullable';
import {
    orElseForResult,
    unwrapOk,
    unwrapErr,
    mapForResult,
    isErr,
    type Result,
    mapErrForResult,
} from 'option-t/esm/PlainResult';

import type { RemoteActionChannel } from './SidebarMessageChannel.js';
import type { SidebarPlainReduxStore } from './SidebarStore.js';
import {
    hasSupportedMimeType,
    isSupportedFirefoxTabDrag,
    tryGetUrlFromFirefoxTab,
    tryToGetTextPlain,
    tryToGetTextUriList,
} from './epic/drag_and_drop.js';

export class SidebarEpic {
    private _channel: RemoteActionChannel;

    constructor(channel: RemoteActionChannel, _store: SidebarPlainReduxStore) {
        this._channel = channel;
    }

    openItem(id: BookmarkId, url: string, where: WhereToOpenItem): void {
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

    async dropItemLikeHyperLink(event: DragEvent): Promise<void> {
        const dataTransfer = event.dataTransfer;
        if (!dataTransfer) {
            return;
        }

        if (!hasSupportedMimeType(dataTransfer)) {
            return;
        }

        if (isSupportedFirefoxTabDrag(dataTransfer)) {
            const items = await tryGetUrlFromFirefoxTab(dataTransfer);
            if (isNotNull(items)) {
                registerMultipleItemViaChannel(this._channel, items);
            }
            return;
        }

        const result = processDropItemLikeHyperLink(dataTransfer);
        if (isErr(result)) {
            const e = unwrapErr(result);
            console.error(e);
            return;
        }

        const list = unwrapOk(result);
        registerMultipleItemViaChannel(this._channel, list);
    }
}

function registerMultipleItemViaChannel(channel: RemoteActionChannel, list: Array<string>): void {
    for (const url of list) {
        registerItemViaChannel(channel, url);
    }
}

// TODO: support text/x-moz-url
function processDropItemLikeHyperLink(dataTransfer: DataTransfer): Result<Array<string>, Error> {
    const textUriList = tryToGetTextUriList(dataTransfer);
    const result = orElseForResult(textUriList, (reason) => {
        const result = tryToGetTextPlain(dataTransfer);
        const normalized = mapForResult(result, (url) => [url]);
        const errorAggregated = mapErrForResult(normalized, (err) => {
            const e = new AggregateError([reason, err]);
            return e;
        });
        return errorAggregated;
    });

    return result;
}
