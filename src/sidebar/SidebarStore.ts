import { Store as ReduxStore } from 'redux';

import { SidebarReduxAction } from './SidebarReduxAction';
import { SidebarReduxThunkDispatch } from './SidebarThunk';

export type SidebarReduxStoreEnhancer = {
    dispatch: SidebarReduxThunkDispatch;
};

export type SidebarReduxStore = ReduxStore<void, SidebarReduxAction> & SidebarReduxStoreEnhancer;
