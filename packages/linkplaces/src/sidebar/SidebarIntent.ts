import type { WhereToOpenItem } from '@linkplaces/ipc_message';
import type { BookmarkId } from '@linkplaces/webext_types';
import type { SidebarEpic } from './SidebarEpic';
import type { SidebarPlainReduxStore } from './SidebarStore';

export class SidebarIntent {
    private _epic: SidebarEpic;

    constructor(epic: SidebarEpic, _store: SidebarPlainReduxStore) {
        this._epic = epic;
    }

    openItem(id: BookmarkId, url: string, where: WhereToOpenItem): void {
        this._epic.openItem(id, url, where);
    }

    pasteItemFromClipboardActionActual(event: ClipboardEvent): void {
        this._epic.pasteItemFromClipboardActionActual(event);
    }
}
