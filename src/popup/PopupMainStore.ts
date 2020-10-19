import { ReduxLikeStore } from '../shared/ReduxLikeStore';
import { PopupMainState } from './PopupMainState';
import { PopupReduxAction } from './PopupReduxAction';

export type PopupPlainReduxStore = ReduxLikeStore<PopupMainState, PopupReduxAction>;
