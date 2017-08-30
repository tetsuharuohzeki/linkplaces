import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Channel } from '../shared/Channel';
import {
    openItem as openItemViaChannel,
    openPlacesOrganizeWindow,
    openWebExtSidebar as openWebExtSidebarDirect,
} from '../shared/RemoteCall';

import {
    createOpenSidebarAction as createOpenSidebarAction,
    createOpenLibraryWindow as createOpenLibraryWindow,
} from './PopupAction';
import { PopupMainState, PopupMainStateTree } from './PopupMainState';

export type ThunkArguments = Readonly<{
    channel: Channel;
}>;

export function openItem(id: string, url: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(_dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        openItemViaChannel(dependencies.channel, id, url);

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openWebExtSidebar(): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openWebExtActual(dispatch: Dispatch<PopupMainState>, _, _dependencies: ThunkArguments): Promise<void> {
        openWebExtSidebarDirect(browser.sidebarAction);

        dispatch(createOpenSidebarAction());

        return closeWindow();
    };
}

export function openLibraryWindow(bookmarkId: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        openPlacesOrganizeWindow(dependencies.channel, bookmarkId);

        dispatch(createOpenLibraryWindow(bookmarkId));

        return closeWindow();
    };
}

async function closeWindow(): Promise<void> {
    window.close();
}
