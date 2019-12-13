import { Store } from 'redux';

import { PopupAction } from './PopupAction';
import { PopupMainStateTree } from './PopupMainState';
import { PopupThunkDispatch } from './PopupMainThunk';

export type PopupMainStore = Store<PopupMainStateTree, PopupAction> & {
    dispatch: PopupThunkDispatch;
};
