import { Store } from 'redux';

import { PopupMainStateTree } from './PopupMainState';
import { PopupReduxAction } from './PopupReduxAction';

export type PlainPopupStore = Store<PopupMainStateTree, PopupReduxAction>;
