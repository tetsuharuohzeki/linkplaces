import { WhereToOpenItem } from '../shared/RemoteAction';
import { SidebarEpic } from './SidebarEpic';
import { SidebarPlainReduxStore } from './SidebarStore';

export class SidebarIntent {
    private _epic: SidebarEpic;

    constructor(epic: SidebarEpic, _store: SidebarPlainReduxStore) {
        this._epic = epic;
    }

    openItem(id: string, url: string, where: WhereToOpenItem): void {
        this._epic.openItem(id, url, where);
    }

    pasteItemFromClipboardActionActual(event: ClipboardEvent): void {
        this._epic.pasteItemFromClipboardActionActual(event);
    }
}
