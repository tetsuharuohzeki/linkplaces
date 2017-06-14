export const enum ActionType {
    OpenSidebar = 'POPUP_ACTION_OPEN_SIDEBAR',
    CloseSidebar = 'POPUP_ACTION_CLOSE_SIDEBAR',
}

export interface Action {
    type: ActionType;
}

export interface OpenSidebarAction extends Action {
    type: ActionType.OpenSidebar;
}
export function isOpenSidebarAction(v: Action): v is OpenSidebarAction {
    return v.type === ActionType.OpenSidebar;
}

export interface CloseSidebarAction extends Action {
    type: ActionType.CloseSidebar;
}
export function isCloseSidebarAction(v: Action): v is CloseSidebarAction {
    return v.type === ActionType.CloseSidebar;
}
