import type { Dispatch } from 'redux';
import type { WhereToOpenItem } from '../shared/RemoteAction';
import {
    openItem as openItemViaChannel,
} from '../shared/RemoteCall';
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

export function openItem(id: string, url: string, where: WhereToOpenItem): SidebarReduxThunkAction<never> {
    return async function openItemActual(_dispatch: Dispatch<never>, _, dependencies: SidebarReduxThunkArguments): Promise<void> {
        openItemViaChannel(dependencies.channel, id, url, where);
    };
}
