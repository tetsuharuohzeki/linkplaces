import { ThunkAction as ThunkActionArcheType, ThunkDispatch } from '../third_party/redux-thunk';

import {
    SidebarReduxAction,
} from './SidebarAction';
import { SidebarViewEpic } from './SidebarEpic';
import { SidebarIntent } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';
import { SidebarReduxStateTree } from './SidebarState';

export type SidebarReduxThunkAction<TAction extends SidebarReduxAction = SidebarReduxAction> = ThunkActionArcheType<Promise<void>, SidebarReduxStateTree, SidebarReduxThunkArguments, TAction>;

export type SidebarReduxThunkArguments = Readonly<{
    channel: RemoteActionChannel;
    intent: SidebarIntent;
    repo: SidebarRepository;
    epic: SidebarViewEpic;
}>;

export type SidebarReduxThunkDispatch = ThunkDispatch<SidebarReduxStateTree, SidebarReduxThunkArguments, SidebarReduxAction>;
