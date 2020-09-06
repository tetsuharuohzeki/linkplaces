import {
    Action as ActionArcheType
} from 'redux';
import { SidebarState } from './SidebarState';

export const enum SidebarActionType {
    Init = 'SIDEBAR_ACTION_INIT',
    UpdateFromSource = 'SIDEBAR_ACTION_UPDATE_FROM_SOURCE',
}

export type SidebarReduxAction =
    InitAction |
    UpdateFromSourceAction;

type ActionBase = ActionArcheType<SidebarActionType>;

export interface InitAction extends ActionBase {
    type: SidebarActionType.Init;
}
export function isInitAction(v: ActionBase): v is InitAction {
    return v.type === SidebarActionType.Init;
}
export function createInitAction(): InitAction {
    return {
        type: SidebarActionType.Init,
    };
}

export interface UpdateFromSourceAction extends ActionBase {
    type: SidebarActionType.UpdateFromSource;
    state: Readonly<SidebarState>;
}
export function isUpdateFromSourceAction(v: ActionBase): v is UpdateFromSourceAction {
    return v.type === SidebarActionType.UpdateFromSource;
}
export function createUpdateFromSourceAction(state: Readonly<SidebarState>): UpdateFromSourceAction {
    return {
        type: SidebarActionType.UpdateFromSource,
        state,
    };
}
