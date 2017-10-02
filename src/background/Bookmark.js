/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/* eslint-env webextensions */

// @ts-ignore
import * as _ from '../typings/webext/index'; // eslint-disable-line no-unused-vars
import {
    removeBookmarkItem as removeBookmarkItemWebExt,
    createBookmarkItem as createBookmarkItemWebExt,
} from '../shared/Bookmark';
import {
    IPC_MSG_TYPE_CLASSIC_CREATE_ITEM,
    IPC_MSG_TYPE_CLASSIC_REMOVE_ITEM
} from './OverIpcAction';
import { gClassicRuntimePort } from './port';

export {
    getLinkSchemeType,
} from '../shared/Bookmark';

// workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1375981
export const useClassicBookmarkBackend =
    // @ts-ignore
    !process.env.IS_WEBEXT_BUILD;// eslint-disable-line no-undef

/**
 *  @param {string} url
 *  @param {string} title
 *  @return {Promise<void>}
 */
export function createBookmarkItem(url, title) {
    if (useClassicBookmarkBackend) {
        gClassicRuntimePort.postOneShotMessage(IPC_MSG_TYPE_CLASSIC_CREATE_ITEM, {
            url,
            title,
        });
        return Promise.resolve();
    }
    else {
        // @ts-ignore
        return createBookmarkItemWebExt(url, title);
    }
}

/**
 *  @param {string}  id
 *  @returns    {Promise<void>}
 */
export function removeBookmarkItem(id) {
    if (useClassicBookmarkBackend) {
        gClassicRuntimePort.postOneShotMessage(IPC_MSG_TYPE_CLASSIC_REMOVE_ITEM, {
            id,
        });
        return Promise.resolve();
    }
    else {
        return removeBookmarkItemWebExt(id);
    }
}
