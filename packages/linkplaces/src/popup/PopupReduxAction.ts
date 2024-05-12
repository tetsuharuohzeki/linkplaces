import type { ActionArcheType } from '@linkplaces/foundation';
import type { OnChangeInfo, BookmarkTreeNode } from '@linkplaces/webext_types';

export enum PopupReduxActionType {
    Init = 'POPUP_ACTION_INIT',
    ItemChanged = 'POPUP_ACTION_ITEM_CHANGED',
}

export type PopupReduxAction = InitAction | ItemChangedAction;

type PopupReduxActionBase = ActionArcheType<PopupReduxActionType>;

export interface InitAction extends PopupReduxActionBase {
    type: PopupReduxActionType.Init;
    list: Array<BookmarkTreeNode>;
}
export function isInitAction(v: PopupReduxActionBase): v is InitAction {
    return v.type === PopupReduxActionType.Init;
}
export function createInitAction(list: Array<BookmarkTreeNode>): InitAction {
    return {
        type: PopupReduxActionType.Init,
        list,
    };
}

export interface ItemChangedAction extends PopupReduxActionBase {
    type: PopupReduxActionType.ItemChanged;
    id: string;
    changeInfo: OnChangeInfo;
}
export function isItemChangedActionAction(v: Readonly<PopupReduxActionBase>): v is ItemChangedAction {
    return v.type === PopupReduxActionType.ItemChanged;
}
export function createItemChangedAction(id: string, changeInfo: OnChangeInfo): ItemChangedAction {
    return {
        type: PopupReduxActionType.ItemChanged,
        id,
        changeInfo,
    };
}
