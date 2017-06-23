/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check

import { createBookmarkItem } from './Bookmark';

/*global browser: false, console:false */

const CTXMENU_ID_TAB_SAVE_TAB = 'linkplaces-ctx-tab-save-tab';
const CTXMENU_ID_CONTENT_SAVE_TAB = 'linkplaces-ctx-content-save-tab';
const CTXMENU_ID_LINK_SAVE_LINK = 'linkplaces-ctx-link-save-link';

export function createContextMenu() {
    const list = [
        {
            type: 'normal',
            id: CTXMENU_ID_TAB_SAVE_TAB,
            title: 'Add Tab to LinkPlaces',
            contexts: ['tab'],
        },
        {
            type: 'normal',
            id: CTXMENU_ID_CONTENT_SAVE_TAB,
            title: 'Add Page to LinkPlaces',
            contexts: ['page'],
        },
        {
            type: 'normal',
            id: CTXMENU_ID_LINK_SAVE_LINK,
            title: 'Add Link to LinkPlaces',
            contexts: ['link'],
        },
    ];

    for (const item of list) {
        // @ts-ignore
        browser.contextMenus.create(item);
    }

    // @ts-ignore
    browser.contextMenus.onClicked.addListener(onClicked);
}

export function removeContextMenu() {
    // @ts-ignore
    browser.contextMenus.onClicked.removeListener(onClicked);

    // @ts-ignore
    return browser.contextMenus.removeAll();
}

// @ts-ignore
function onClicked(info /* :webext$contextMenusInternal$OnClickData */, tab /* :?webext$tabs$Tab */) {
    switch (info.menuItemId) {
        case CTXMENU_ID_TAB_SAVE_TAB: {
            if (!tab) {
                throw new TypeError();
            }

            const { title, url } = tab;
            if (typeof title !== 'string' || typeof url !== 'string') {
                throw new TypeError();
            }
            createBookmarkItem(url, title).catch(console.error);
            break;
        }
        case CTXMENU_ID_CONTENT_SAVE_TAB: {
            const url = info.pageUrl;
            if (typeof url !== 'string') {
                throw new TypeError();
            }

            const title /* :string */ = ((!!tab) && (typeof tab.title === 'string')) ? tab.title : url;
            createBookmarkItem(url, title).catch(console.error);
            break;
        }
        case CTXMENU_ID_LINK_SAVE_LINK: {
            const url = info.linkUrl;
            if (typeof url !== 'string') {
                throw new TypeError();
            }
            // `OnClickData` does not have a property containing the link title.
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/OnClickData
            // So we'll skip it.
            createBookmarkItem(url, url).catch(console.error);
            break;
        }
        default:
            throw new RangeError('unexpected `info.menuItemId`');
    }
}
