import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getLinkSchemeType } from '../shared/Bookmark';
import { Channel } from '../shared/Channel';

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
