import { ReduxLikeStore } from '@linkplaces/foundation';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { useSyncExternalStore } from 'react';

import { createInitialPopupMainState, type PopupMainState, reducePopupMain } from './popup_main_state.js';
import type { PopupReduxAction } from './popup_redux_action.js';

export type PopupPlainReduxStore = ReduxLikeStore<PopupMainState, PopupReduxAction>;

export function createPopupMainStore(list: Array<BookmarkTreeNode>): PopupPlainReduxStore {
    const initial = createInitialPopupMainState(list);
    const store = ReduxLikeStore.create<PopupMainState, PopupReduxAction>(reducePopupMain, initial);
    return store;
}

export function usePopupMainState(store: PopupPlainReduxStore): PopupMainState {
    const state: PopupMainState = useSyncExternalStore(
        (onStoreChange) => {
            const disposer = store.subscribe(onStoreChange);
            return () => {
                disposer();
            };
        },
        () => {
            const state = store.state();
            return state;
        }
    );
    return state;
}
