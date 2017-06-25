import { combineReducers, Reducer, } from 'redux';
import { Action, ActionType } from './PopupIntent';

export interface PopupMainState {
}

export function reducePopupMain(prev: PopupMainState, action: Action): PopupMainState {
    switch (action.type) {
        case ActionType.OpenSidebar:
            console.log('open sidebar');
            return prev;
        case ActionType.ItemOpened:
            console.log('opend item');
            return prev;
        case ActionType.ItemChanged: {
            return prev;
        }
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
