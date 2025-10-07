import type { ActionArcheType } from '@linkplaces/foundation';
import type { SidebarState } from './sidebar_state.js';

export enum SidebarReduxActionType {
    Init = 'SIDEBAR_ACTION_INIT',
    UpdateFromSource = 'SIDEBAR_ACTION_UPDATE_FROM_SOURCE',
}

export type SidebarReduxAction = InitAction | UpdateFromSourceAction;

type SidebarReduxActionBase = ActionArcheType<SidebarReduxActionType>;

export interface InitAction extends SidebarReduxActionBase {
    type: SidebarReduxActionType.Init;
}
export function isInitAction(v: SidebarReduxActionBase): v is InitAction {
    return v.type === SidebarReduxActionType.Init;
}
export function createInitAction(): InitAction {
    return {
        type: SidebarReduxActionType.Init,
    };
}

export interface UpdateFromSourceAction extends SidebarReduxActionBase {
    type: SidebarReduxActionType.UpdateFromSource;
    state: Readonly<SidebarState>;
}
export function isUpdateFromSourceAction(v: SidebarReduxActionBase): v is UpdateFromSourceAction {
    return v.type === SidebarReduxActionType.UpdateFromSource;
}
export function createUpdateFromSourceAction(state: Readonly<SidebarState>): UpdateFromSourceAction {
    return {
        type: SidebarReduxActionType.UpdateFromSource,
        state,
    };
}
