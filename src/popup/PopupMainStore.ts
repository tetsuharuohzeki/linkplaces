import { Store } from 'redux';

import { ThunkExt } from '../third_party/redux-thunk';

import { PopupMainStateTree } from './PopupMainState';
import { PopupAction } from './PopupAction';

export type PopupMainThunkExt = ThunkExt<PopupAction, PopupMainStateTree>;
export type PopupMainStore = Store<PopupMainStateTree> & PopupMainThunkExt;
