/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
/*eslint-env webextensions */

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
        case 'current':
            return openInCurrent(currentId, url);
        case 'save':
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads/download
            throw new RangeError('unimplemented!: where is `save`');
        case 'window':
            return openInNewWindow(url);
        case 'tab':
            option.active = true;
            break;
        case 'tabshifted':
            break;
        default:
            throw new RangeError('unexpeced where type');
    }

    const newTab = await browser.tabs.create(option);
    // @ts-ignore
    const id = newTab.id;
    if (id === undefined || id === null) {
        throw new TypeError('id should not null');
    }

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
    // @ts-ignore
    const currentId = currentTab.id;
    if (currentId === undefined || currentId === null) {
        throw new TypeError('currentId should not null');
    }

    return currentId;
}

/**
 *  @param {number} tabId
 *  @param {string} url
 *  @return {Promise<number>}
 */
export async function openInCurrent(tabId, url) {
    // @ts-ignore
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
    // @ts-ignore
    const current = await browser.windows.getCurrent({
        windowTypes: ['normal'],
    });

    // @ts-ignore
    const window = await browser.windows.create({
        url,
        // XXX: Firefox has not supported yet.
        // focused: true,
        type: 'normal',
        state: 'normal',
        incognito: current.incognito,
    });
    const tabs /* :?Array<webext$tabs$Tab> */ = window.tabs;
    if (!tabs) {
        throw new TypeError('window.tabs should not be null');
    }

    const tab = tabs[0];
    if (!tab) {
        throw new TypeError('window.tabs[0] would be the current tab');
    }

    const id = tab.id;
    if (id === undefined || id === null) {
        throw new TypeError('id should not null');
    }

    return id;
}
