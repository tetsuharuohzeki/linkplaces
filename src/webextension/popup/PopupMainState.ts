import { combineReducers, Reducer, } from 'redux';
import { BookmarkTreeNode } from '../../../typings/webext/bookmarks';
import { Action, ActionType } from './PopupAction';

export interface PopupMainState {
    list: Array<BookmarkTreeNode>;
}

export function reducePopupMain(prev: PopupMainState, action: Action): PopupMainState {
    switch (action.type) {
        case ActionType.Init: {
            prev.list = action.list;
            return prev;
        }
        case ActionType.OpenSidebar:
            return prev;
        case ActionType.ItemOpened:
            return prev;
        case ActionType.ItemChanged: {
            return prev;
        }
        default: {
            const state = (prev === undefined) ? {
                list: [],
            } : prev;
            return state;
        }
    }
}

export type PopupMainStateTree = {
    reducePopupMain: PopupMainState;
};

export function createReducer(): Reducer<PopupMainStateTree> {
    const reducer = combineReducers<PopupMainStateTree>({
        reducePopupMain,
    });
    return reducer;
}
