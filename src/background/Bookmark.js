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

export {
    getLinkSchemeType,
} from '../shared/Bookmark';

/**
 *  @param {string} url
 *  @param {string} title
 *  @return {Promise<void>}
 */
export function createBookmarkItem(url, title) {
    // @ts-ignore
    return createBookmarkItemWebExt(url, title);
}

/**
 *  @param {string}  id
 *  @returns    {Promise<void>}
 */
export function removeBookmarkItem(id) {
    return removeBookmarkItemWebExt(id);
}
