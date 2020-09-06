import { Undefinable } from 'option-t/esm/Undefinable/Undefinable';
import { combineReducers, Reducer } from 'redux';
import { SidebarActionType, SidebarReduxAction } from './SidebarAction';
import { SidebarItemViewModelEntity } from './SidebarDomain';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

function createInitialSidebarState(list: Iterable<SidebarItemViewModelEntity> = []): SidebarState {
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
        case SidebarActionType.UpdateFromSource: {
            const state = action.state;
            return state;
        }
        default:
            return prev;
    }
}

export interface SidebarReduxStateTree {
    classicState: SidebarState;
}

export function createSidebarReduxStateTree(state: SidebarState): SidebarReduxStateTree {
    return {
        classicState: state,
    };
}

export function createSidebarReduxReducer(): Reducer<SidebarReduxStateTree> {
    const reducer = combineReducers<SidebarReduxStateTree>({
        classicState: reduceSidebarReduxState,
    });
    return reducer;
}
