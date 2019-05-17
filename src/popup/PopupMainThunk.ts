import { Dispatch } from 'redux';
import { ThunkAction as ThunkActionArcheType, ThunkDispatch } from '../third_party/redux-thunk';

import {
    WhereToOpenItem,
    WHERE_TO_OPEN_ITEM_TO_TAB,
} from '../shared/RemoteAction';
import {
    openItem as openItemViaChannel,
    openWebExtSidebar as openWebExtSidebarDirect,
} from '../shared/RemoteCall';

import {
    createOpenSidebarAction,
    OpenSidebarAction,
    PopupAction,
} from './PopupAction';
import { PopupMainStateTree } from './PopupMainState';
import { RemoteActionChannel } from './PopupMessageChannel';

export type PopupThunkAction<TAction extends PopupAction = PopupAction> = ThunkActionArcheType<Promise<void>, PopupMainStateTree, PopupThunkArguments, TAction>;

export type PopupThunkArguments = Readonly<{
    channel: RemoteActionChannel;
}>;

export type PopupThunkDispatch = ThunkDispatch<PopupMainStateTree, PopupThunkArguments, PopupAction>;

export function openItem(id: string, url: string): PopupThunkAction<never> {
    return function openItemActual(_dispatch: Dispatch<never>, _, dependencies: PopupThunkArguments): Promise<void> {
        const where: WhereToOpenItem = WHERE_TO_OPEN_ITEM_TO_TAB;
        openItemViaChannel(dependencies.channel, id, url, where);

        return closeWindow();
    };
}

export function openWebExtSidebar(): PopupThunkAction<OpenSidebarAction> {
    return function openWebExtActual(dispatch: Dispatch<OpenSidebarAction>, _, _dependencies: PopupThunkArguments): Promise<void> {
        openWebExtSidebarDirect(browser.sidebarAction);

        dispatch(createOpenSidebarAction());

        return closeWindow();
    };
}

export function openLibraryWindow(_bookmarkId: string): PopupThunkAction<never> {
    return function openLibraryWindowActual(_dispatch: Dispatch<never>, _, _dependencies: PopupThunkArguments): Promise<void> {
        return closeWindow();
    };
}

async function closeWindow(): Promise<void> {
    await sleepWithTimeout(0);
    window.close();
}

function sleepWithTimeout(millisec: number): Promise<void> {
    const p = new Promise<void>((resolve) => window.setTimeout(resolve, millisec));
    return p;
}
