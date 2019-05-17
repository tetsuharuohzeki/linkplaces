import { Store } from 'redux';

import { PopupMainStateTree } from './PopupMainState';
import { PopupAction } from './PopupAction';
import { PopupThunkDispatch } from './PopupMainThunk';

export type PopupMainStore = Store<PopupMainStateTree, PopupAction> & {
    dispatch: PopupThunkDispatch;
};
