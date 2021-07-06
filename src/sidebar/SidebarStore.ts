import { Observable } from 'rxjs';
import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { ReduxLikeStore } from '../foundation/ReduxLikeStore';

import { SidebarReduxAction, SidebarReduxActionType } from './SidebarReduxAction';
import { createInitialSidebarState, SidebarState } from './SidebarState';

function reduceSidebarReduxState(prev: SidebarState, action: SidebarReduxAction): SidebarState {
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

export function createSidebarStateObservable(store: SidebarPlainReduxStore): Observable<SidebarState>{
    const reduxSource = new Observable<SidebarState>((subscripber) => {
        const teardown = store.subscribe(() => {
            const s = store.state();
            subscripber.next(s);
        });

        return () => {
            teardown();
        };
    });

    return reduxSource;
}
