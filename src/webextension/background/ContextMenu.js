/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check

// @ts-ignore
import * as _ from '../../../typings/webext/index'; // eslint-disable-line no-unused-vars
import { OnClickData, CreateArgument } from '../../../typings/webext/contextMenus'; // eslint-disable-line no-unused-vars
import { Tab } from '../../../typings/webext/tabs'; // eslint-disable-line no-unused-vars

import { createBookmarkItem } from './Bookmark';

/* eslint-env browser, webextensions */

const CTXMENU_ID_TAB_SAVE_TAB = 'linkplaces-ctx-tab-save-tab';
const CTXMENU_ID_CONTENT_SAVE_TAB = 'linkplaces-ctx-content-save-tab';
const CTXMENU_ID_LINK_SAVE_LINK = 'linkplaces-ctx-link-save-link';

/**
 *  @return {void}
 */
export function createContextMenu() {
    /** @type   {Array<CreateArgument>} */
    // @ts-ignore
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
        browser.contextMenus.create(item);
    }

    browser.contextMenus.onClicked.addListener(onClicked);
}

/**
 *  @return {void}
 */
export function removeContextMenu() {
    browser.contextMenus.onClicked.removeListener(onClicked);

    return browser.contextMenus.removeAll();
}

/**
 *  @param  {OnClickData} info
 *  @param  {Tab} tab
 *  @return {void}
 */
function onClicked(info, tab) {
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
