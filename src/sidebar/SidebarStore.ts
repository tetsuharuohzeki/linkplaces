import { Observable } from 'rxjs';
import { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { ReduxLikeStore } from '../shared/ReduxLikeStore';

import { SidebarReduxAction } from './SidebarReduxAction';
import { createInitialSidebarState, reduceSidebarReduxState, SidebarState } from './SidebarState';

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
