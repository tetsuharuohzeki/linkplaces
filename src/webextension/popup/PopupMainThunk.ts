import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Channel } from '../shared/Channel';
import {
    openItem as openItemViaChannel,
    openPlacesOrganizeWindow,
    openClassicSidebar,
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

export function openSidebar(): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        openClassicSidebar(dependencies.channel);

        dispatch(createOpenSidebarAction());

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openLibraryWindow(bookmarkId: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        openPlacesOrganizeWindow(dependencies.channel, bookmarkId);

        dispatch(createOpenLibraryWindow(bookmarkId));

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}
