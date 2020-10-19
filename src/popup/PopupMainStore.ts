import { Store } from 'redux';

import { PopupAction } from './PopupAction';
import { PopupMainStateTree } from './PopupMainState';

export type PlainPopupStore = Store<PopupMainStateTree, PopupAction>;
