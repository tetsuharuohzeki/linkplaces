/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/* eslint-env webextensions */

// @ts-ignore
import * as _ from '../../../typings/webext/index'; // eslint-disable-line no-unused-vars
//import { BookmarkTreeNode } from '../../../typings/webext/bookmarks'; // eslint-disable-line no-unused-vars
export { getLinkSchemeType, removeBookmarkItem, createBookmarkItem } from '../shared/Bookmark';

// workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1375981
export const useClassicBookmarkBackend = true;
