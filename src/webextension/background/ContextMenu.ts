/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { OnClickData, CreateArgument } from '../../../typings/webext/contextMenus';
import { Tab } from '../../../typings/webext/tabs';

import { createBookmarkItem } from './Bookmark';

const CTXMENU_ID_TAB_SAVE_TAB = 'linkplaces-ctx-tab-save-tab';
const CTXMENU_ID_CONTENT_SAVE_PAGE = 'linkplaces-ctx-content-save-page';
const CTXMENU_ID_LINK_SAVE_LINK = 'linkplaces-ctx-link-save-link';

export function createContextMenu(): void {
    const list: Array<CreateArgument> = [
        {
            type: 'normal',
            id: CTXMENU_ID_TAB_SAVE_TAB,
            title: 'Add Tab to LinkPlaces',
            contexts: ['tab'],
        } as CreateArgument,
        {
            type: 'normal',
            id: CTXMENU_ID_CONTENT_SAVE_PAGE,
            title: 'Add Page to LinkPlaces',
            contexts: ['page'],
        } as CreateArgument,
        {
            type: 'normal',
            id: CTXMENU_ID_LINK_SAVE_LINK,
            title: 'Add Link to LinkPlaces',
            contexts: ['link'],
        } as CreateArgument,
    ];

    for (const item of list) {
        browser.contextMenus.create(item);
    }

    browser.contextMenus.onClicked.addListener(onClicked);
}

export function removeContextMenu(): Promise<void> {
    browser.contextMenus.onClicked.removeListener(onClicked);

    return browser.contextMenus.removeAll();
}

function onClicked(info: OnClickData, tab: Tab | null | undefined): void {
    switch (info.menuItemId) {
        case CTXMENU_ID_TAB_SAVE_TAB: {
            if (tab === null || tab === undefined) {
                throw new TypeError('could not find `tab`');
            }
            onClickSaveTab(tab).catch(console.error);
            break;
        }
        case CTXMENU_ID_CONTENT_SAVE_PAGE: {
            if (tab === null || tab === undefined) {
                throw new TypeError('could not find `tab`');
            }
            onClickSavePage(info, tab).catch(console.error);
            break;
        }
        case CTXMENU_ID_LINK_SAVE_LINK: {
            onClickSaveLink(info).catch(console.error);
            break;
        }
        default:
            throw new RangeError(`unexpected \`info.menuItemId\`. info: ${JSON.stringify(info)}`);
    }
}

function onClickSaveTab(tab: Tab): Promise<void> {
    const { title, url } = tab;
    if (typeof title !== 'string' || typeof url !== 'string') {
        throw new TypeError('Cannot found both of `title` & `url`');
    }
    const created = createBookmarkItem(url, title);
    return created;
}

function onClickSavePage(info: OnClickData, tab: Tab): Promise<void> {
    const url = info.pageUrl;
    if (typeof url !== 'string') {
        throw new TypeError('Cannot found `info.linkUrl`');
    }

    const title: string = (typeof tab.title === 'string') ? tab.title : url;
    const created = createBookmarkItem(url, title);
    return created;
}

function onClickSaveLink(info: OnClickData): Promise<void> {
    const url = info.linkUrl;
    if (typeof url !== 'string') {
        throw new TypeError('Cannot found `info.linkUrl`');
    }

    const linkText = info.linkText;
    const title = (typeof linkText === 'string') ? linkText : url;
    const created = createBookmarkItem(url, title);
    return created;
}
