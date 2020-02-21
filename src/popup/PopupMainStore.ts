import type { Store } from 'redux';

import type { PopupAction } from './PopupAction';
import type { PopupMainStateTree } from './PopupMainState';
import type { PopupThunkDispatch } from './PopupMainThunk';

export type PopupMainStore = Store<PopupMainStateTree, PopupAction> & {
    dispatch: PopupThunkDispatch;
};
