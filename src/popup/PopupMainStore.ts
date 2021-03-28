import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { ReduxLikeStore } from '../shared/ReduxLikeStore';
import { createInitialPopupMainState, PopupMainState, reducePopupMain } from './PopupMainState';
import type { PopupReduxAction } from './PopupReduxAction';

export type PopupPlainReduxStore = ReduxLikeStore<PopupMainState, PopupReduxAction>;

export function createPopupMainStore(list: Array<BookmarkTreeNode>): PopupPlainReduxStore {
    const initial = createInitialPopupMainState(list);
    const store = ReduxLikeStore.create<PopupMainState, PopupReduxAction>(reducePopupMain, initial);
    return store;
}
