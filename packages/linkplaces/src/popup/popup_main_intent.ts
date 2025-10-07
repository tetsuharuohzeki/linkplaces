import type { BookmarkId } from '@linkplaces/webext_types';
import type { PopupMainEpic } from './popup_main_epic.js';
import type { PopupPlainReduxStore } from './popup_main_store.js';

export class PopupMainIntent {
    private _epic: PopupMainEpic;
    // private _store: PlainPopupStore;

    constructor(epic: PopupMainEpic, _store: PopupPlainReduxStore) {
        this._epic = epic;
    }

    async openItem(id: BookmarkId, url: string): Promise<void> {
        await this._epic.openItem(id, url);
    }

    async openWebExtSidebar(): Promise<void> {
        await this._epic.openWebExtSidebar();
    }
}
