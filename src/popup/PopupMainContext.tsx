// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import type { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';


import { PopupMainEpic } from './PopupMainEpic';
import { PopupMainIntent } from './PopupMainIntent';
import { createPopupMainStore } from './PopupMainStore';
import { PopupMainView } from './PopupMainView';
import type { RemoteActionChannel } from './PopupMessageChannel';
import { PopupRepostiroy } from './PopupRepository';

export class PopupMainContext implements ViewContext {

    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _renderRoot: Nullable<ReactDOM.Root>;
    private _disposerSet: Nullable<Set<() => void>>;

    constructor(channel: RemoteActionChannel, list: Array<BookmarkTreeNode>) {
        this._channel = channel;
        this._list = list;
        this._renderRoot = null;
        this._disposerSet = null;
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._disposerSet)) {
            throw new TypeError();
        }

        if (USE_REACT_CONCURRENT_MODE) {
            this._renderRoot = ReactDOM.createRoot(mountpoint);
        }

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

            if (USE_REACT_CONCURRENT_MODE) {
                const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
                renderRoot.render(view);
            } else {
                ReactDOM.render(view, mountpoint);
            }
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

        if (USE_REACT_CONCURRENT_MODE) {
            const renderRoot = expectNotNull(this._renderRoot, '');
            renderRoot.unmount();
        } else {
            ReactDOM.unmountComponentAtNode(_mountpoint);
        }
        this._renderRoot = null;
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }

    onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
