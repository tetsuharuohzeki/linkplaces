import { Nullable } from 'option-t/esm/Nullable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyMiddleware, createStore, Store, Unsubscribe } from 'redux';
import thunk from 'redux-thunk';

import { Channel } from '../shared/Channel';
import { ViewContext } from '../shared/ViewContext';

import { BookmarkTreeNode, OnChangeInfo } from '../../typings/webext/bookmarks';

import { PopupMainView } from './PopupMainView';

import { createItemChangedAction } from './PopupAction';
import { createReducer, PopupMainStateTree, createInitialPopupMainStateTree } from './PopupMainState';
import { ThunkArguments } from './PopupMainThunk';

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
        if (this._disposerSet !== null) {
            throw new TypeError();
        }

        const reducer = createReducer();
        const args: ThunkArguments = {
            channel: this._channel,
        };
        const middleware = thunk.withExtraArgument(args);

        const initial = createInitialPopupMainStateTree(this._list);
        const store: Store<PopupMainStateTree> = createStore<PopupMainStateTree>(reducer, initial, applyMiddleware(middleware));

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
        if (this._disposerSet === null) {
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
