import type { BookmarkOnChangedEventListener, OnChangeInfo, WebExtBookmarkService } from '@linkplaces/webext_types';
import type { PopupPlainReduxStore } from './PopupMainStore.js';
import { createItemChangedAction } from './PopupReduxAction.js';

export class PopupRepostiroy {
    private _onChanged: BookmarkOnChangedEventListener;
    private _store: PopupPlainReduxStore;
    private _bookmarks: WebExtBookmarkService;

    constructor(bookmarks: WebExtBookmarkService, reduxStore: PopupPlainReduxStore) {
        this._store = reduxStore;
        this._bookmarks = bookmarks;
        this._onChanged = (id, info) => {
            this._onChangedImpl(id, info);
        };
    }

    destroy(): void {
        // release reference
        this._store = null as never;
        this._bookmarks = null as never;
    }

    start(): void {
        this._bookmarks.onChanged.addListener(this._onChanged);
    }

    stop(): void {
        this._bookmarks.onChanged.removeListener(this._onChanged);
    }

    private _onChangedImpl(id: string, info: OnChangeInfo): void {
        const a = createItemChangedAction(id, info);
        this._store.dispatch(a);
    }
}
