import { combineReducers, Reducer, } from 'redux';
import { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { Action, ActionType } from './PopupAction';

export interface PopupMainState {
    list: Array<BookmarkTreeNode>;
}

function createInitialPopupMainState(list: Array<BookmarkTreeNode> = []): PopupMainState {
    return {
        list: list,
    };
}

export function reducePopupMain(prev: PopupMainState = createInitialPopupMainState(), action: Action): PopupMainState {
    switch (action.type) {
        case ActionType.Init: {
            prev.list = action.list;
            return prev;
        }
        case ActionType.OpenSidebar:
            return prev;
        case ActionType.ItemChanged: {
            return prev;
        }
        default: {
            return prev;
        }
    }
}

export type PopupMainStateTree = {
    reducePopupMain: PopupMainState;
};

export function createInitialPopupMainStateTree(list: Array<BookmarkTreeNode>): PopupMainStateTree {
    return {
        reducePopupMain: createInitialPopupMainState(list),
    };
}

export function createReducer(): Reducer<PopupMainStateTree> {
    const reducer = combineReducers<PopupMainStateTree>({
        reducePopupMain,
    });
    return reducer;
}
