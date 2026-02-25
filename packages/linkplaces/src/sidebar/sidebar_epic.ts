import { type RemoteActionChannel, type WhereToOpenItem, openItem, registerItem } from '@linkplaces/ipc_message';
import type { BookmarkId } from '@linkplaces/webext_types';

import { isNotNull } from 'option-t/nullable';
import { unwrapOk, unwrapErr, isErr, type Result, ResultOperator } from 'option-t/plain_result';

import {
    hasSupportedMimeType,
    isSupportedFirefoxTabDrag,
    tryGetUrlFromFirefoxTab,
    tryToGetTextPlain,
    tryToGetTextUriList,
} from './epic/drag_and_drop.js';
import type { SidebarPlainReduxStore } from './sidebar_store.js';

export class SidebarEpic {
    private _channel: RemoteActionChannel;

    constructor(channel: RemoteActionChannel, _store: SidebarPlainReduxStore) {
        this._channel = channel;
    }

    async openItem(id: BookmarkId, url: string, where: WhereToOpenItem): Promise<void> {
        await openItem(this._channel, id, url, where);
    }

    async pasteItemFromClipboardActionActual(event: ClipboardEvent): Promise<void> {
        const data = event.clipboardData;
        if (!data) {
            return;
        }

        const url = data.getData('text/plain');

        await registerItem(this._channel, url);
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
                await registerMultipleItemViaChannel(this._channel, items);
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
        await registerMultipleItemViaChannel(this._channel, list);
    }
}

async function registerMultipleItemViaChannel(channel: RemoteActionChannel, list: Array<string>): Promise<void> {
    const promises = [];
    for (const url of list) {
        const registered = registerItem(channel, url);
        promises.push(registered);
    }
    await Promise.all(promises);
}

// TODO: support text/x-moz-url
function processDropItemLikeHyperLink(dataTransfer: DataTransfer): Result<Array<string>, Error> {
    const textUriList = tryToGetTextUriList(dataTransfer);
    const result = ResultOperator.orElse(textUriList, (reason) => {
        const result = tryToGetTextPlain(dataTransfer);
        const normalized = ResultOperator.map(result, (url) => [url]);
        const errorAggregated = ResultOperator.mapErr(normalized, (err) => {
            const e = new AggregateError([reason, err]);
            return e;
        });
        return errorAggregated;
    });

    return result;
}
