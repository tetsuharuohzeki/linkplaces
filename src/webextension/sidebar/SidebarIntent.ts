import { Observable, Subject } from 'rxjs';

export class SidebarIntent {

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
}

export const enum ActionType {
    OpenItem = 'SIDEBAR_ACTION_ITEM_OPEND',
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
