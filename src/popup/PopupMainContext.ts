import { Nullable, isNotNull, isNull } from 'option-t/esm/Nullable/Nullable';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, Store, Unsubscribe, Middleware } from 'redux';
import thunk from 'redux-thunk';

import { Channel } from '../shared/Channel';
import { ViewContext } from '../shared/ViewContext';

import { BookmarkTreeNode, OnChangeInfo } from '../../typings/webext/bookmarks';

import { PopupMainView } from './PopupMainView';

import { createItemChangedAction, PopupAction } from './PopupAction';
import { createReducer, PopupMainStateTree, createInitialPopupMainStateTree } from './PopupMainState';
import { ThunkArguments, ThunkDispatch } from './PopupMainThunk';

export class PopupMainContext implements ViewContext {

    private _channel: Channel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Nullable<Set<Unsubscribe>>;

    constructor(channel: Channel, list: Array<BookmarkTreeNode>) {
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
        const middleware: Middleware<{}, PopupMainStateTree, ThunkDispatch> = thunk.withExtraArgument(args);
        const enhancer = applyMiddleware(middleware);

        const initial = createInitialPopupMainStateTree(this._list);
        const store: Store<PopupMainStateTree> = createStore<PopupMainStateTree, PopupAction, {}, ThunkDispatch>(reducer, initial, enhancer);

        const render = () => {
            const { reducePopupMain: state, } = store.getState();

            const view = React.createElement(PopupMainView, {
                state,
                store,
            }, []);
            ReactDOM.render(view, mountpoint);
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
