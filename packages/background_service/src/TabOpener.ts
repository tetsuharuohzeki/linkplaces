import { WhereToOpenItem } from '@linkplaces/ipc_message';
import { type TabId, type BrowserWindow, browser } from '@linkplaces/webext_types';

import { expectNotNullOrUndefined } from 'option-t/maybe';
import { expectNotUndefined } from 'option-t/undefinable';

export async function createTab(url: string, where: WhereToOpenItem): Promise<TabId> {
    switch (where) {
        case WhereToOpenItem.Current:
            return openItemInCurrentTab(url);
        case WhereToOpenItem.Window:
            return openItemInNewWindow(url);
        case WhereToOpenItem.Tab:
            return openItemInNewTab(url, true);
        case WhereToOpenItem.BackgroundTab:
            return openItemInNewTab(url, false);
        default:
            throw new RangeError('unexpeced where type');
    }
}

async function getCurrentTabId(): Promise<TabId> {
    const tabList = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
        windowType: 'normal',
    });
    if (tabList.length === 0) {
        throw new Error("assert!: don't get the current tab");
    }

    const currentTab = expectNotUndefined(tabList[0], 'currentTab should not be undefined');
    const currentId = expectNotNullOrUndefined(currentTab.id, 'currentId should not null');

    return currentId;
}

async function openItemInCurrentTab(url: string): Promise<TabId> {
    const currentTabId = await getCurrentTabId();
    await browser.tabs.update(currentTabId, {
        url,
    });

    return currentTabId;
}

async function openItemInNewWindow(url: string): Promise<TabId> {
    const lastFocused = await getLastFocusedWindow();

    const window = await browser.windows.create({
        url,
        focused: true,
        type: 'normal',
        state: 'normal',
        incognito: lastFocused.incognito,
    });
    const tabs = expectNotNullOrUndefined(window.tabs, 'window.tabs should not be null');
    const tab = expectNotUndefined(tabs[0], 'window.tabs[0] would be the current tab');
    const id = expectNotNullOrUndefined(tab.id, 'id should not null');
    return id;
}

async function openItemInNewTab(url: string, shouldActive: boolean): Promise<TabId> {
    const lastFocused = await getLastFocusedWindow();

    const option = {
        active: shouldActive,
        url,
        windowId: lastFocused.id,
    };

    const newTab = await browser.tabs.create(option);
    const id = expectNotNullOrUndefined(newTab.id, 'id should not null');

    return id;
}

function getLastFocusedWindow(): Promise<BrowserWindow> {
    const w = browser.windows.getLastFocused({});
    return w;
}
