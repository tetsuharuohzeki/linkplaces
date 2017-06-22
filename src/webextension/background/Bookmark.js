/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/* eslint-env webextensions */

// @ts-ignore
import * as _ from '../../../typings/webext/index'; // eslint-disable-line no-unused-vars
import { BookmarkTreeNode } from '../../../typings/webext/bookmarks'; // eslint-disable-line no-unused-vars
export { getLinkSchemeType } from '../shared/Bookmark';

/**
 *  @param {string} url
 *  @param {string} title
 *  @return {Promise<BookmarkTreeNode>}
 */
export async function createBookmarkItem(url, title) {
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
    // Save to "Other Bookmarks" if there is no `parentId`
    const result = browser.bookmarks.create({
        url,
        title,
    });
    return result;
}
