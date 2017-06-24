export const enum ActionType {
    OpenSidebar = 'POPUP_ACTION_OPEN_SIDEBAR',
    CloseSidebar = 'POPUP_ACTION_CLOSE_SIDEBAR',

    OpenOpenLibraryWindow = 'POPUP_ACTION_OPEN_LIBRARY_WINDOW',

    ItemOpening = 'POPUP_ACTION_ITEM_OPENING',
    ItemOpened = 'POPUP_ACTION_ITEM_OPEND',
}

export type Action =
    OpenSidebarAction |
    CloseSidebarAction |
    OpenLibraryWindowAction |
    ItemOpenedAction;

interface ActionBase {
    type: ActionType;
}

export interface OpenSidebarAction extends ActionBase {
    type: ActionType.OpenSidebar;
}
export function isOpenSidebarAction(v: ActionBase): v is OpenSidebarAction {
    return v.type === ActionType.OpenSidebar;
}
export function openSidebar(): OpenSidebarAction {
    return {
        type: ActionType.OpenSidebar,
    };
}

export interface CloseSidebarAction extends ActionBase {
    type: ActionType.CloseSidebar;
}
export function isCloseSidebarAction(v: ActionBase): v is CloseSidebarAction {
    return v.type === ActionType.CloseSidebar;
}

export interface ItemOpeningAction extends ActionBase {
    type: ActionType.ItemOpening;
    id: string;
    url: string;
}
export function isOpeningItemAction(v: Readonly<ActionBase>): v is ItemOpenedAction {
    return v.type === ActionType.ItemOpening;
}
export function notifyItemOpening(id: string, url: string): ItemOpeningAction {
    return {
        type: ActionType.ItemOpening,
        id,
        url,
    };
}

export interface ItemOpenedAction extends ActionBase {
    type: ActionType.ItemOpened;
    id: string;
    url: string;
}
export function isOpenItemAction(v: Readonly<ActionBase>): v is ItemOpenedAction {
    return v.type === ActionType.ItemOpened;
}
export function notifyItemOpened(id: string, url: string): ItemOpenedAction {
    return {
        type: ActionType.ItemOpened,
        id,
        url,
    };
}

export interface OpenLibraryWindowAction extends ActionBase {
    type: ActionType.OpenOpenLibraryWindow;
    id: string;
}
export function isOpenLibraryWindowAction(v: Readonly<ActionBase>): v is OpenLibraryWindowAction {
    return v.type === ActionType.OpenOpenLibraryWindow;
}
export function openLibraryWindow(id: string): OpenLibraryWindowAction {
    return {
        type: ActionType.OpenOpenLibraryWindow,
        id,
    };
}
