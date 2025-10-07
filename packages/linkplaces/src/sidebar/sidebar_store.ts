import { ReduxLikeStore } from '@linkplaces/foundation';
import { operators, type Unsubscribable } from '@linkplaces/foundation/rx';

import type { SidebarRepository } from './repository/sidebar_repository.js';
import type { SidebarItemViewModelEntity } from './sidebar_domain.js';
import {
    createUpdateFromSourceAction,
    type SidebarReduxAction,
    SidebarReduxActionType,
} from './sidebar_redux_action.js';
import { createInitialSidebarState, type SidebarState } from './sidebar_state.js';

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

export function createSidebarStore(initial: Iterable<SidebarItemViewModelEntity>): SidebarPlainReduxStore {
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
