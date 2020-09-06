import {
    Action as ActionArcheType
} from 'redux';

export const enum SidebarActionType {
    Init = 'SIDEBAR_ACTION_INIT',
}

export type SidebarReduxAction =
    InitAction;

type ActionBase = ActionArcheType<SidebarActionType>;

export interface InitAction extends ActionBase {
    type: SidebarActionType.Init;
}
export function isInitAction(v: ActionBase): v is InitAction {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return v.type === SidebarActionType.Init;
}
export function createInitAction(): InitAction {
    return {
        type: SidebarActionType.Init,
    };
}
