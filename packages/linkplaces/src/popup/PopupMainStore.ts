import type { BookmarkTreeNode } from '@linkplaces/webext_types';
import { ReduxLikeStore } from '../foundation/ReduxLikeStore';
import { createInitialPopupMainState, PopupMainState, reducePopupMain } from './PopupMainState';
import type { PopupReduxAction } from './PopupReduxAction';

export type PopupPlainReduxStore = ReduxLikeStore<PopupMainState, PopupReduxAction>;

export function createPopupMainStore(list: Array<BookmarkTreeNode>): PopupPlainReduxStore {
    const initial = createInitialPopupMainState(list);
    const store = ReduxLikeStore.create<PopupMainState, PopupReduxAction>(reducePopupMain, initial);
    return store;
}
