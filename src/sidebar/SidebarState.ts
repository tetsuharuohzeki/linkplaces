import { Undefinable } from 'option-t/esm/Undefinable/Undefinable';
import { SidebarItemViewModelEntity } from './SidebarDomain';
import { SidebarReduxActionType, SidebarReduxAction } from './SidebarReduxAction';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

export function createInitialSidebarState(list: Iterable<SidebarItemViewModelEntity> = []): SidebarState {
    return {
        list: list,
    };
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
