import { Dispatch } from 'redux';
import { ThunkAction as ThunkActionArcheType } from '../third_party/redux-thunk';

import { Channel } from '../shared/Channel';
import {
    WhereToOpenItem,
    WHERE_TO_OPEN_ITEM_TO_TAB,
} from '../shared/RemoteAction';
import {
    openItem as openItemViaChannel,
    openPlacesOrganizeWindow,
    openWebExtSidebar as openWebExtSidebarDirect,
} from '../shared/RemoteCall';

import {
    createOpenSidebarAction,
    createOpenLibraryWindow,
    OpenSidebarAction,
    OpenLibraryWindowAction,
    PopupAction,
} from './PopupAction';
import { PopupMainStateTree } from './PopupMainState';

type ThunkAction<A extends PopupAction = PopupAction> = ThunkActionArcheType<A, PopupMainStateTree, ThunkArguments, Promise<void>>;

export type ThunkArguments = Readonly<{
    channel: Channel;
}>;

export function openItem(id: string, url: string): ThunkAction<never> {
    return function openItemActual(_dispatch: Dispatch<never>, _, dependencies: ThunkArguments): Promise<void> {
        const where: WhereToOpenItem = WHERE_TO_OPEN_ITEM_TO_TAB;
        openItemViaChannel(dependencies.channel, id, url, where);

        return closeWindow();
    };
}

export function openWebExtSidebar(): ThunkAction<OpenSidebarAction> {
    return function openWebExtActual(dispatch: Dispatch<OpenSidebarAction>, _, _dependencies: ThunkArguments): Promise<void> {
        openWebExtSidebarDirect(browser.sidebarAction);

        dispatch(createOpenSidebarAction());

        return closeWindow();
    };
}

export function openLibraryWindow(bookmarkId: string): ThunkAction<OpenLibraryWindowAction> {
    return function openLibraryWindowActual(dispatch: Dispatch<OpenLibraryWindowAction>, _, dependencies: ThunkArguments): Promise<void> {
        openPlacesOrganizeWindow(dependencies.channel, bookmarkId);

        dispatch(createOpenLibraryWindow(bookmarkId));

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
