import type {
    Action as ActionArcheType
} from 'redux';

import type {
    OnChangeInfo,
    BookmarkTreeNode,
} from '../../typings/webext/bookmarks';

export const enum ActionType {
    Init = 'POPUP_ACTION_INIT',

    OpenSidebar = 'POPUP_ACTION_OPEN_SIDEBAR',

    OpenOpenLibraryWindow = 'POPUP_ACTION_OPEN_LIBRARY_WINDOW',

    ItemChanged = 'POPUP_ACTION_ITEM_CHANGED',
}

export type PopupAction =
    InitAction |
    OpenSidebarAction |
    ItemChangedAction;

type ActionBase = ActionArcheType<ActionType>;

export interface InitAction extends ActionBase {
    type: ActionType.Init;
    list: Array<BookmarkTreeNode>;
}
export function isInitAction(v: ActionBase): v is InitAction {
    return v.type === ActionType.Init;
}
export function createInitAction(list: Array<BookmarkTreeNode>): InitAction {
    return {
        type: ActionType.Init,
        list,
    };
}

export interface OpenSidebarAction extends ActionBase {
    type: ActionType.OpenSidebar;
}
export function isOpenSidebarAction(v: ActionBase): v is OpenSidebarAction {
    return v.type === ActionType.OpenSidebar;
}
export function createOpenSidebarAction(): OpenSidebarAction {
    return {
        type: ActionType.OpenSidebar,
    };
}

export interface ItemChangedAction extends ActionBase {
    type: ActionType.ItemChanged;
    id: string;
    changeInfo: OnChangeInfo;
}
export function isItemChangedActionAction(v: Readonly<ActionBase>): v is ItemChangedAction {
    return v.type === ActionType.ItemChanged;
}
export function createItemChangedAction(id: string, changeInfo: OnChangeInfo): ItemChangedAction {
    return {
        type: ActionType.ItemChanged,
        id,
        changeInfo,
    };
}
