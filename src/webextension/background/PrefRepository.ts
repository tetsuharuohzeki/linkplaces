import { Observable, Subject } from 'rxjs';
import { Repository } from '../shared/Repository';

export class PrefRepository implements Repository<PrefTable> {

    private _table: PrefTable;
    private _subject: Subject<PrefTable>;

    constructor() {
        this._table = new PrefTable();
        this._subject = new Subject();
    }

    destroy(): void {
        this._subject.unsubscribe();
    }

    get table(): PrefTable {
        return this._table;
    }

    update(action: UpdatePrefAction): void {
        switch (action.type) {
            case PrefActionKind.OpenLinkToWhere:
                this._table.setOpenLinkToWhere(action.value);
                break;
            default:
                throw RangeError(`${action.type} is not undefined type`);
        }
        this._subject.next(this._table);
    }

    asObservable(): Observable<PrefTable> {
        return this._subject.asObservable();
    }
}

export class PrefTable {

    private _openLinkToWhere: string;
    focusSidebarWhenOpenItems: boolean;

    constructor() {
        this._openLinkToWhere = "tab";
        this.focusSidebarWhenOpenItems = false;
        Object.seal(this);
    }

    get openLinkToWhere(): string {
        return this._openLinkToWhere;
    }

    setOpenLinkToWhere(v: number): void {
        switch (v) {
            case 0:
                this._openLinkToWhere = "current";
                break;
            case 1:
                this._openLinkToWhere = "tab";
                break;
            case 2:
                this._openLinkToWhere = "tabshifted";
                break;
            case 3:
                this._openLinkToWhere = "window";
                break;
            default:
                throw new RangeError("found undefined value");
        }
    }
}

export const enum PrefActionKind {
    OpenLinkToWhere,
}

export type UpdatePrefAction = UpdateOpenLinkToWhere;

export interface UpdateOpenLinkToWhere {
    type: PrefActionKind.OpenLinkToWhere;
    value: number;
}
