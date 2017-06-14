import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, Store, Unsubscribe } from 'redux';

import { ViewContext } from '../shared/ViewContext';

import { PopupMainView } from './view/PopupMainView';

import { createReducer, PopupMainState } from './PopupMainState';

export class PopupMainContext implements ViewContext {

    private _disposer: Unsubscribe | null;

    constructor() {
        this._disposer = null;
    }

    onActivate(mountpoint: Element): void {
        if (this._disposer !== null) {
            throw new TypeError();
        }

        const reducer = createReducer();
        const store: Store<PopupMainState> = createStore(reducer, {});

        const render = () => {
            const state: PopupMainState = store.getState();

            const view = React.createElement(PopupMainView, {
                state,
            }, []);
            ReactDOM.render(view, mountpoint);
        };

        this._disposer = store.subscribe(render);
        render();
    }

    onDestroy(mountpoint: Element): void {
        if (this._disposer === null) {
            throw new TypeError();
        }

        this._disposer();
        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    onResume(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error("Method not implemented.");
    }
}
