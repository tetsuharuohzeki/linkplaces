/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env webextensions */

import { expectNotNullAndUndefined } from 'option-t/esm/Maybe/expect';
import { expectNotUndefined } from 'option-t/esm/Undefinable/expect';

import { NoImplementationError } from '../shared/NoImplementationError';
import {
    WHERE_TO_OPEN_ITEM_TO_TAB,
    WHERE_TO_OPEN_ITEM_TO_TABSHIFTED,
    WHERE_TO_OPEN_ITEM_TO_WINDOW,
    WHERE_TO_OPEN_ITEM_TO_CURRENT,
    WHERE_TO_OPEN_ITEM_TO_SAVE,
} from '../shared/RemoteAction';



/**
 *  @param  {string}  url
 *  @param  {string}  where
 *  @returns  {Promise<number>}
 *    `tabs.Tab.id`. integer.
 */
export async function createTab(url, where) {
    const currentId = await getCurrentTabId();

    const option = {
        active: false,
        url,
        windowId: undefined,
    };

    switch (where) {
        case WHERE_TO_OPEN_ITEM_TO_CURRENT:
            return openInCurrent(currentId, url);
        case WHERE_TO_OPEN_ITEM_TO_SAVE:
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads/download
            throw new NoImplementationError('unimplemented!: where is `save`');
        case WHERE_TO_OPEN_ITEM_TO_WINDOW:
            return openInNewWindow(url);
        case WHERE_TO_OPEN_ITEM_TO_TAB:
            option.active = true;
            break;
        case WHERE_TO_OPEN_ITEM_TO_TABSHIFTED:
            break;
        default:
            throw new RangeError('unexpeced where type');
    }

    const newTab = await browser.tabs.create(option);
    const id = expectNotNullAndUndefined(newTab.id, 'id should not null');

    return id;
}

async function getCurrentTabId() {
    const tabList = await browser.tabs.query({
        active: true,
        currentWindow: true,
        windowType: 'normal',
    });
    if (tabList.length === 0) {
        throw new Error("assert!: don't get the current tab");
    }

    const currentTab = tabList[0];
    const currentId = expectNotNullAndUndefined(currentTab.id, 'currentId should not null');

    return currentId;
}

/**
 *  @param {number} tabId
 *  @param {string} url
 *  @return {Promise<number>}
 */
export async function openInCurrent(tabId, url) {
    await browser.tabs.update(tabId, {
        url,
    });

    return tabId;
}

/**
 *  @param {string} url
 *  @return {Promise<number>}
 */
export async function openInNewWindow(url) {
    const current = await browser.windows.getCurrent({
        windowTypes: ['normal'],
    });

    const window = await browser.windows.create({
        url,
        // XXX: Firefox has not supported yet.
        // focused: true,
        type: 'normal',
        state: 'normal',
        incognito: current.incognito,
    });
    const tabs = expectNotNullAndUndefined(window.tabs, 'window.tabs should not be null');
    const tab = expectNotUndefined(tabs[0], 'window.tabs[0] would be the current tab');
    const id = expectNotNullAndUndefined(tab.id, 'id should not null');
    return id;
}
