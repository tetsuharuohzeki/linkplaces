import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { removeBookmarkItem, getLinkSchemeType } from './Bookmark';
import { notifyItemOpened, notifyItemOpening } from './PopupIntent';
import { PopupMainState } from './PopupMainState';

export function openItem(id: string, url: string): ThunkAction<Promise<void>, PopupMainState, void> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _: PopupMainState): Promise<void> {
        if (getLinkSchemeType(url).isPrivileged) {
            return Promise.resolve().then(() => {
                window.close();
            });
        }

        return Promise.resolve()
            .then(() => {
                dispatch(notifyItemOpening(id, url));
            })
            .then(() => {
                return removeBookmarkItem(id);
            })
            .then(() => {
                dispatch(notifyItemOpened(id, url));
            })
            .then(() => {
                window.close();
            }).catch(console.exception);
    };
}
