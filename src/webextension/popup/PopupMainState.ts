import { combineReducers, Reducer, } from 'redux';
import { removeBookmarkItem, getLinkSchemeType } from './Bookmark'
import { Action, ActionType } from './PopupIntent';

export interface PopupMainState {
}

export function reducePopupMain(prev: PopupMainState, action: Action): PopupMainState {
    switch (action.type) {
        case ActionType.OpenSidebar:
            console.log('open sidebar');
            return prev;
        case ActionType.ItemOpened:
            if (getLinkSchemeType(action.url).isPrivileged) {
                window.close();
                return prev;
            }
            const id = action.id;
            removeBookmarkItem(id).then(() => window.close(), console.exception).catch(console.exception);
            return prev;
        default: {
            const state = (prev === undefined) ? {} : prev;
            return state;
        }
    }
}

export function createReducer(): Reducer<PopupMainState> {
    const reducer = combineReducers({
        reducePopupMain,
    });
    return reducer;
}
