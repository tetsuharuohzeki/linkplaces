import { ReduxLikeStore } from '@linkplaces/foundation';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import { type SidebarReduxAction, SidebarReduxActionType } from './SidebarReduxAction.js';
import { createInitialSidebarState, type SidebarState } from './SidebarState.js';

function reduceSidebarReduxState(prev: SidebarState, action: SidebarReduxAction): SidebarState {
    // FIXME:
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (action.type) {
        case SidebarReduxActionType.UpdateFromSource: {
            const state = action.state;
            return state;
        }
        default:
            return prev;
    }
}

export type SidebarPlainReduxStore = ReduxLikeStore<SidebarState, SidebarReduxAction>;

export function createSidebarStore(initial: Array<BookmarkTreeNode>): SidebarPlainReduxStore {
    const initialState = createInitialSidebarState(initial);
    const store = ReduxLikeStore.create<SidebarState, SidebarReduxAction>(reduceSidebarReduxState, initialState);
    return store;
}
