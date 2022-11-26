import type { OnChangeInfo, WebExtBookmarkService } from '@linkplaces/webext_types';
import type { PopupPlainReduxStore } from './PopupMainStore.js';
import { createItemChangedAction } from './PopupReduxAction.js';

export class PopupRepostiroy {
    private _onChanged: typeof PopupRepostiroy.prototype.onChanged = this.onChanged.bind(this);
    private _store: PopupPlainReduxStore;
    private _bookmarks: WebExtBookmarkService;

    constructor(bookmarks: WebExtBookmarkService, reduxStore: PopupPlainReduxStore) {
        this._store = reduxStore;
        this._bookmarks = bookmarks;

        bookmarks.onChanged.addListener(this._onChanged);
    }

    destroy(): void {
        this._bookmarks.onChanged.removeListener(this._onChanged);

        // release reference
        this._store = null as never;
        this._bookmarks = null as never;
    }

    onChanged(id: string, info: OnChangeInfo): void {
        const a = createItemChangedAction(id, info);
        this._store.dispatch(a);
    }
}
