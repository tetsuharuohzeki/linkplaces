import type { WhereToOpenItem } from '@linkplaces/ipc_message';
import type { BookmarkId } from '@linkplaces/webext_types';
import type { SidebarEpic } from './SidebarEpic.js';
import type { SidebarPlainReduxStore } from './SidebarStore.js';

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

    dropItemLikeHyperLink(event: DragEvent): void {
        this._epic.dropItemLikeHyperLink(event);
    }
}
