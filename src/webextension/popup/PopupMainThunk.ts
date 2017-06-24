import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getLinkSchemeType } from '../shared/Bookmark';
import { Channel } from '../shared/Channel';

import { openSidebar as createOpenSidebarAction } from './PopupIntent';
import { PopupMainState } from './PopupMainState';

export type ThunkArguments = Readonly<{
    channel: Channel;
}>;

export function openItem(id: string, url: string): ThunkAction<Promise<void>, PopupMainState, ThunkArguments> {
    return function openItemActual(_dispatch: Dispatch<PopupMainState>, _1: PopupMainState, dependencies: ThunkArguments): Promise<void> {
        if (!getLinkSchemeType(url).isPrivileged) {
            dependencies.channel.postOneShotMessage('linkplaces-open-url-from-popup', { id, url });
        }

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openSidebar(): ThunkAction<Promise<void>, PopupMainState, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _1: PopupMainState, dependencies: ThunkArguments): Promise<void> {
        dependencies.channel.postOneShotMessage('linkplaces-open-classic-sidebar-from-popup', null);

        dispatch(createOpenSidebarAction());

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}
