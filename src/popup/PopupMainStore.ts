import { Store } from 'redux';

import { PopupMainStateTree } from './PopupMainState';
import { PopupReduxAction } from './PopupReduxAction';

export type PopupPlainReduxStore = Store<PopupMainStateTree, PopupReduxAction>;
