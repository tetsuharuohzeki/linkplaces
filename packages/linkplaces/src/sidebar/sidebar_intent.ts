import type { WhereToOpenItem } from '@linkplaces/ipc_message';
import type { BookmarkId } from '@linkplaces/webext_types';
import type { SidebarEpic } from './sidebar_epic.js';
import type { SidebarPlainReduxStore } from './sidebar_store.js';

export class SidebarIntent {
    private _epic: SidebarEpic;

    constructor(epic: SidebarEpic, _store: SidebarPlainReduxStore) {
        this._epic = epic;
    }

    async openItem(id: BookmarkId, url: string, where: WhereToOpenItem): Promise<void> {
        await this._epic.openItem(id, url, where);
    }

    pasteItemFromClipboardActionActual(event: ClipboardEvent): void {
        this._epic.pasteItemFromClipboardActionActual(event).catch(console.error);
    }

    dropItemLikeHyperLink(event: DragEvent): void {
        this._epic.dropItemLikeHyperLink(event).catch(console.error);
    }
}
