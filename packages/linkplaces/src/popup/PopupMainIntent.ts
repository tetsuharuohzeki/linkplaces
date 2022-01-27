import type { BookmarkId } from '@linkplaces/webext_types';
import type { PopupMainEpic } from './PopupMainEpic';
import type { PopupPlainReduxStore } from './PopupMainStore';

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
