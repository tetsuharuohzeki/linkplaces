// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react/next" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/next" />

import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import { StrictMode } from 'react';

import { ReactRuledViewContext } from '../foundation/view_ctx/ReactRuledViewContext';

import { PopupMainEpic } from './PopupMainEpic';
import { PopupMainIntent } from './PopupMainIntent';
import { createPopupMainStore } from './PopupMainStore';
import { PopupMainView } from './PopupMainView';
import type { RemoteActionChannel } from './PopupMessageChannel';
import { PopupRepostiroy } from './PopupRepository';

export class PopupMainContext extends ReactRuledViewContext {

    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Nullable<Set<() => void>>;

    constructor(channel: RemoteActionChannel, list: Array<BookmarkTreeNode>) {
        super();
        this._channel = channel;
        this._list = list;
        this._disposerSet = null;
    }

    destroy(): void {
        this._list = null as never;
        this._channel = null as never;
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._disposerSet)) {
            throw new TypeError();
        }

        this._initRenderRoot(mountpoint);

        const store = createPopupMainStore(this._list);
        const epic = new PopupMainEpic(this._channel, store);
        const intent = new PopupMainIntent(epic, store);

        const render = () => {
            const state = store.state();
            const view = (
                <StrictMode>
                    <PopupMainView state={state} intent={intent} />
                </StrictMode>
            );

            const renderRoot = this._getRenderRoot();
            renderRoot.render(view);
        };

        const repository = new PopupRepostiroy(browser.bookmarks, store);

        this._disposerSet = new Set([
            store.subscribe(render),
            () => { repository.destroy(); }
        ]);

        // ignite the first rendering
        render();
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        if (isNull(this._disposerSet)) {
            throw new TypeError();
        }

        this._disposerSet.forEach((fn) => fn());
        this._disposerSet.clear();
        this._disposerSet = null;
        this._destroyRenderRoot();
    }
}
