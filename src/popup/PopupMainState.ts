import type { Undefinable } from 'option-t/esm/Undefinable/Undefinable';

import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { PopupReduxAction, PopupReduxActionType } from './PopupReduxAction';

export interface PopupMainState {
    list: Array<BookmarkTreeNode>;
}

export function createInitialPopupMainState(list: Array<BookmarkTreeNode> = []): PopupMainState {
    return {
        list: list,
    };
}

export function reducePopupMain(prev: Undefinable<PopupMainState>, action: PopupReduxAction): PopupMainState {
    // redux call a reducer with `undefined` to initialize the reducer.
    // We assume this is special case.
    if (prev === undefined) {
        const initial = createInitialPopupMainState();
        return initial;
    }

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
