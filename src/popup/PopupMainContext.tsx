import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, Unsubscribe, StoreEnhancer } from 'redux';
import { createThunkMiddleware, ThunkExt } from '../third_party/redux-thunk';

import { ViewContext } from '../shared/ViewContext';

import { BookmarkTreeNode, OnChangeInfo } from '../../typings/webext/bookmarks';

import { PopupMainView } from './PopupMainView';

import { createItemChangedAction, PopupAction } from './PopupAction';
import { createReducer, PopupMainStateTree, createInitialPopupMainStateTree } from './PopupMainState';
import { ThunkArguments } from './PopupMainThunk';
import { PopupMainStore, PopupMainThunkExt } from './PopupMainStore';
import { RemoteActionChannel } from './PopupMessageChannel';

export class PopupMainContext implements ViewContext {

    private _channel: RemoteActionChannel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Nullable<Set<Unsubscribe>>;

    constructor(channel: RemoteActionChannel, list: Array<BookmarkTreeNode>) {
        this._channel = channel;
        this._list = list;
        this._disposerSet = null;
    }

    onActivate(mountpoint: Element): void {
        if (isNotNull(this._disposerSet)) {
            throw new TypeError();
        }

        const reducer = createReducer();
        const args: ThunkArguments = {
            channel: this._channel,
        };
        const middleware = createThunkMiddleware<PopupAction, PopupMainStateTree, ThunkArguments, Promise<void>>(args);
        const enhancer: StoreEnhancer<ThunkExt<PopupAction, PopupMainStateTree>> = applyMiddleware(middleware);
        const initial = createInitialPopupMainStateTree(this._list);
        const store: PopupMainStore = createStore<PopupMainStateTree, PopupAction, PopupMainThunkExt, PopupMainStateTree>(reducer, initial, enhancer);

        const render = () => {
            window.requestAnimationFrame(() => {
                const { reducePopupMain: state, } = store.getState();
                const view = (
                    <React.StrictMode>
                        <PopupMainView state={state} store={store} />
                    </React.StrictMode>
                );
                ReactDOM.render(view, mountpoint);
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

    onDestroy(mountpoint: Element): void {
        if (isNull(this._disposerSet)) {
            throw new TypeError();
        }

        this._disposerSet.forEach((fn) => fn());
        this._disposerSet.clear();
        this._disposerSet = null;

        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    onResume(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
}
