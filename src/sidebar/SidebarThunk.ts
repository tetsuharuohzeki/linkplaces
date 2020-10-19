import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import type { Dispatch } from 'redux';
import type { WhereToOpenItem } from '../shared/RemoteAction';
import {
    openItem as openItemViaChannel,
    registerItem as registerItemViaChannel,
} from '../shared/RemoteCall';
import { ThunkAction as ThunkActionArcheType, ThunkDispatch } from '../third_party/redux-thunk';


import {
    SidebarReduxAction,
} from './SidebarReduxAction';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';
import { SidebarReduxStateTree } from './SidebarState';

export type SidebarReduxThunkAction<TAction extends SidebarReduxAction = SidebarReduxAction> = ThunkActionArcheType<Promise<void>, SidebarReduxStateTree, SidebarReduxThunkArguments, TAction>;

export type SidebarReduxThunkArguments = Readonly<{
    channel: RemoteActionChannel;
    repo: SidebarRepository;
}>;

export type SidebarReduxThunkDispatch = ThunkDispatch<SidebarReduxStateTree, SidebarReduxThunkArguments, SidebarReduxAction>;

export function openItem(id: string, url: string, where: WhereToOpenItem): SidebarReduxThunkAction<never> {
    return async function openItemActual(_dispatch: Dispatch<never>, _, dependencies: SidebarReduxThunkArguments): Promise<void> {
        openItemViaChannel(dependencies.channel, id, url, where);
    };
}

export function pasteItemFromClipboardAction(event: ClipboardEvent): Nullable<SidebarReduxThunkAction<never>> {
    const data = event.clipboardData;
    if (!data) {
        return null;
    }

    const url = data.getData('text/plain');

    return async function pasteItemFromClipboardActionActual(_dispatch: Dispatch<never>, _, dependencies: SidebarReduxThunkArguments): Promise<void> {
        registerItemViaChannel(dependencies.channel, url);
    };
}
