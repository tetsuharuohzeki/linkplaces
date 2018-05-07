import { Store } from 'redux';
import { PopupMainStateTree } from './PopupMainState';
import { ThunkExt } from '../third_party/redux-thunk';
import { PopupAction } from './PopupAction';

export type PopupMainThunkExt = ThunkExt<PopupAction, PopupMainStateTree>;
export type PopupMainStore = Store<PopupMainStateTree> & PopupMainThunkExt;
