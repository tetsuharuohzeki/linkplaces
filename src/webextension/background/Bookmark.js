/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* @flow */

/*global browser: false */

export async function createBookmarkItem(url /* :string*/, title /* :string*/) /* :Promise<webext$bookmarks$BookmarkTreeNode> */ {
  // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
  // Save to "Other Bookmarks" if there is no `parentId`
  const result = browser.bookmarks.create({
    url,
    title,
  });
  return result;
}
