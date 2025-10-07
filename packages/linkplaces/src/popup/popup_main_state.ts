import type { BookmarkTreeNode } from '@linkplaces/webext_types';
import { type PopupReduxAction, PopupReduxActionType } from './popup_redux_action.js';

export interface PopupMainState {
    list: Array<BookmarkTreeNode>;
}

export function createInitialPopupMainState(list: Array<BookmarkTreeNode> = []): PopupMainState {
    return {
        list: list,
    };
}

export function reducePopupMain(prev: PopupMainState, action: PopupReduxAction): PopupMainState {
    switch (action.type) {
        case PopupReduxActionType.Init: {
            const next = {
                ...prev,
                list: action.list,
            };
            return next;
        }
        case PopupReduxActionType.ItemChanged: {
            return prev;
        }
        default: {
            return prev;
        }
    }
}
