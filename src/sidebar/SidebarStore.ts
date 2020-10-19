import { ReduxLikeStore } from '../shared/ReduxLikeStore';

import { SidebarReduxAction } from './SidebarReduxAction';
import { SidebarState } from './SidebarState';

export type SidebarPlainReduxStore = ReduxLikeStore<SidebarState, SidebarReduxAction>;
