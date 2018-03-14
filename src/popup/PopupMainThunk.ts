import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

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
import { PopupMainState, PopupMainStateTree } from './PopupMainState';

export type ThunkDispatch<A extends PopupAction = PopupAction> = Dispatch<A, PopupMainState>;

export type ThunkArguments = Readonly<{
    channel: Channel;
}>;

export function openItem(id: string, url: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(_dispatch: ThunkDispatch<never>, _, dependencies: ThunkArguments): Promise<void> {
        const where: WhereToOpenItem = WHERE_TO_OPEN_ITEM_TO_TAB;
        openItemViaChannel(dependencies.channel, id, url, where);

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openWebExtSidebar(): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openWebExtActual(dispatch: ThunkDispatch<OpenSidebarAction>, _, _dependencies: ThunkArguments): Promise<void> {
        openWebExtSidebarDirect(browser.sidebarAction);

        dispatch(createOpenSidebarAction());

        return closeWindow();
    };
}

export function openLibraryWindow(bookmarkId: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openLibraryWindowActual(dispatch: ThunkDispatch<OpenLibraryWindowAction>, _, dependencies: ThunkArguments): Promise<void> {
        openPlacesOrganizeWindow(dependencies.channel, bookmarkId);

        dispatch(createOpenLibraryWindow(bookmarkId));

        return closeWindow();
    };
}

async function closeWindow(): Promise<void> {
    window.close();
}
