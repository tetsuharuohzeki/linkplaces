import { Store as ReduxStore } from 'redux';

import { SidebarReduxAction } from './SidebarReduxAction';

export type SidebarPlainReduxStore = ReduxStore<void, SidebarReduxAction>;
