import { Observable, Subject } from 'rxjs';

import { Dispatchable } from '../shared/Intent';

export class SidebarIntent implements Dispatchable<Action> {

    private _subject: Subject<Action>;

    constructor() {
        this._subject = new Subject();
    }

    destroy(): void {
        this._subject.unsubscribe();
        this._subject = null as any;
    }

    dispatch(action: Action): void {
        this._subject.next(action);
    }

    openItem(): Observable<OpenItemAction> {
        return this._subject.asObservable().filter(isOpenItemAction);
    }

    selectItem(): Observable<SelectItemAction> {
        return this._subject.asObservable().filter(isSelectItemAction);
    }
}

export const enum ActionType {
    OpenItem = 'SIDEBAR_ACTION_ITEM_OPEND',
    SelectItem = 'SIDEBAR_ACTION_SELECT_ITEM'
}

export type Action =
    OpenItemAction;

interface ActionBase {
    type: ActionType;
}

export interface OpenItemAction extends ActionBase {
    type: ActionType.OpenItem;
    id: string;
    url: string;
}
export function isOpenItemAction(v: Readonly<ActionBase>): v is OpenItemAction {
    return v.type === ActionType.OpenItem;
}
export function notifyOpenItem(id: string, url: string): OpenItemAction {
    return {
        type: ActionType.OpenItem,
        id,
        url,
    };
}

export interface SelectItemAction extends ActionBase {
    type: ActionType.SelectItem;
    id: string;
}
export function isSelectItemAction(v: Readonly<ActionBase>): v is SelectItemAction {
    return v.type === ActionType.SelectItem;
}
export function notifySelectItemAction(id: string): SelectItemAction {
    return {
        type: ActionType.SelectItem,
        id,
    };
}

