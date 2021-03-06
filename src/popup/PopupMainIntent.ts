import { PopupMainEpic } from './PopupMainEpic';
import { PopupPlainReduxStore } from './PopupMainStore';

export class PopupMainIntent {
    private _epic: PopupMainEpic;
    // private _store: PlainPopupStore;

    constructor(epic: PopupMainEpic, _store: PopupPlainReduxStore) {
        this._epic = epic;
    }

    async openItem(id: string, url: string): Promise<void> {
        await this._epic.openItem(id, url);
    }

    async openWebExtSidebar(): Promise<void> {
        await this._epic.openWebExtSidebar();
    }

    async openLibraryWindow(bookmarkId: string): Promise<void> {
        await this._epic.openLibraryWindow(bookmarkId);
    }
}
