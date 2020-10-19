// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { StrictMode} from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, Unsubscribe } from 'redux';

import { BookmarkTreeNode, OnChangeInfo } from '../../typings/webext/bookmarks';

import { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';


import { createItemChangedAction, PopupAction } from './PopupAction';
import { PopupMainEpic } from './PopupMainEpic';
import { PopupMainIntent } from './PopupMainIntent';
import { createReducer, PopupMainStateTree, createInitialPopupMainStateTree } from './PopupMainState';
import { PlainPopupStore as PopupMainStore } from './PopupMainStore';
import { PopupMainView } from './PopupMainView';
import { RemoteActionChannel } from './PopupMessageChannel';

export class PopupMainContext implements ViewContext {

    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _renderRoot: Nullable<ReactDOM.Root>;
    private _disposerSet: Nullable<Set<Unsubscribe>>;

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

        const reducer = createReducer();
        const initial = createInitialPopupMainStateTree(this._list);
        const store: PopupMainStore = createStore<PopupMainStateTree, PopupAction, void, void>(reducer, initial);

        if (USE_REACT_CONCURRENT_MODE) {
            this._renderRoot = ReactDOM.unstable_createRoot(mountpoint);
        }

        const epic = new PopupMainEpic(this._channel, store);
        const intent = new PopupMainIntent(epic, store);

        const render = () => {
            // XXX: Should we remove this wrapping `requestAnimationFrame()` for React concurrent mode?
            // Will React schedule requestAnimationFrame properly?
            window.requestAnimationFrame(() => {
                const { reducePopupMain: state, } = store.getState();
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
            });
        };

        const onChanged = (id: string, info: OnChangeInfo) => {
            const a = createItemChangedAction(id, info);
            store.dispatch(a);
        };
        browser.bookmarks.onChanged.addListener(onChanged);

        this._disposerSet = new Set([
            store.subscribe(render),
            () => { browser.bookmarks.onChanged.removeListener(onChanged); }
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
