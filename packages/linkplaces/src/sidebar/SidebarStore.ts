import { ReduxLikeStore } from '@linkplaces/foundation';
import { operators, type Unsubscribable } from '@linkplaces/foundation/rx';
import type { BookmarkTreeNode } from '@linkplaces/webext_types';

import type { SidebarItemViewModelEntity } from './SidebarDomain.js';
import { createUpdateFromSourceAction, type SidebarReduxAction, SidebarReduxActionType } from './SidebarReduxAction.js';
import { createInitialSidebarState, type SidebarState } from './SidebarState.js';
import type { SidebarRepository } from './repository/SidebarRepository.js';

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

export function subscribeSidebarRepositoryBySidebarStore(
    store: SidebarPlainReduxStore,
    repo: SidebarRepository
): Unsubscribable {
    const subscription = repo
        .asObservable()
        .pipe(operators.subscribeOnNextLoop())
        .subscribeBy({
            onNext(source: Iterable<SidebarItemViewModelEntity>) {
                const state: Readonly<SidebarState> = {
                    list: source,
                };
                const a = createUpdateFromSourceAction(state);
                store.dispatch(a);
            },
        });
    return subscription;
}
