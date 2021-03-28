import type { Undefinable } from 'option-t/esm/Undefinable/Undefinable';
import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { mapToSidebarItemEntity, SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarReduxActionType, SidebarReduxAction } from './SidebarReduxAction';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

export function createInitialSidebarState(list: Array<BookmarkTreeNode> = []): SidebarState {
    const initialState: Readonly<SidebarState> = {
        list: list.map(mapToSidebarItemEntity),
    };
    return initialState;
}


export function reduceSidebarReduxState(prev: Undefinable<SidebarState>, action: SidebarReduxAction): SidebarState {
    // redux call a reducer with `undefined` to initialize the reducer.
    // We assume this is special case.
    if (prev === undefined) {
        const initial = createInitialSidebarState();
        return initial;
    }

    switch (action.type) {
        case SidebarReduxActionType.UpdateFromSource: {
            const state = action.state;
            return state;
        }
        default:
            return prev;
    }
}
