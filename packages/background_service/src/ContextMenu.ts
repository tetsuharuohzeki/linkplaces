import { Ix } from '@linkplaces/foundation';
import { createBookmarkItem, type CreateBookmarkItemResult } from '@linkplaces/shared/bookmark';
import type { OnClickData, CreateArgument, ContextType, Tab, WindowId } from '@linkplaces/webext_types';

import { type Maybe, isNullOrUndefined } from 'option-t/Maybe';
import { type Result, inspectErrOfResult, unwrapOrFromResult } from 'option-t/PlainResult';
import { tryCatchIntoResultWithEnsureErrorAsync } from 'option-t/PlainResult/tryCatchAsync';
import { type Undefinable, expectNotUndefined, unwrapOrFromUndefinable } from 'option-t/Undefinable';

const CTXMENU_ID_TAB_SAVE_TAB = 'linkplaces-ctx-tab-save-tab';
const CTXMENU_ID_CONTENT_SAVE_PAGE = 'linkplaces-ctx-content-save-page';
const CTXMENU_ID_LINK_SAVE_LINK = 'linkplaces-ctx-link-save-link';

function createCtxMenuArg(id: string, title: string, contexts: Array<ContextType>): CreateArgument {
    return {
        type: 'normal',
        id,
        title,
        contexts,
    };
}

export function appendContextMenu(browser: typeof chrome): void {
    const list: Array<CreateArgument> = [
        createCtxMenuArg(CTXMENU_ID_TAB_SAVE_TAB, 'Add Tab to LinkPlaces', ['tab']),
        createCtxMenuArg(CTXMENU_ID_CONTENT_SAVE_PAGE, 'Add Page to LinkPlaces', ['page']),
        createCtxMenuArg(CTXMENU_ID_LINK_SAVE_LINK, 'Add Link to LinkPlaces', ['link']),
    ];

    const onCreateList: Array<Promise<void>> = [];
    for (const item of list) {
        const menu: Promise<void> = new Promise((resolve, reject) => {
            browser.menus.create(item, () => {
                const e = browser.runtime.lastError;
                if (!!e) {
                    reject(e);
                } else {
                    resolve();
                }
            });
        });

        onCreateList.push(menu);
    }

    Promise.all(onCreateList).catch(console.error);
}

export function removeContextMenu(browser: typeof chrome): Promise<void> {
    browser.menus.onClicked.removeListener(onClickContextMenu);
    return browser.menus.removeAll();
}

export function onClickContextMenu(info: OnClickData, tab: Maybe<Tab>): void {
    onClickedAsync(info, tab).catch(console.error);
}

async function onClickedAsync(info: OnClickData, tab: Maybe<Tab>): Promise<void> {
    switch (info.menuItemId) {
        case CTXMENU_ID_TAB_SAVE_TAB: {
            if (isNullOrUndefined(tab)) {
                throw new TypeError('could not find `tab`');
            }
            const resultList = await onClickSaveTab(tab);
            for (const result of resultList) {
                inspectErrOfResult(result, console.error);
            }
            break;
        }
        case CTXMENU_ID_CONTENT_SAVE_PAGE: {
            if (isNullOrUndefined(tab)) {
                throw new TypeError('could not find `tab`');
            }
            const result = await onClickSavePage(info, tab);
            inspectErrOfResult(result, console.error);
            break;
        }
        case CTXMENU_ID_LINK_SAVE_LINK: {
            const result = await onClickSaveLink(info);
            inspectErrOfResult(result, console.error);
            break;
        }
        default:
            throw new RangeError(`unexpected \`info.menuItemId\`. info: ${JSON.stringify(info)}`);
    }
}

async function onClickSaveTab(tab: Tab): Promise<ReadonlyArray<CreateBookmarkItemResult>> {
    const { title: titleMaybe, url, windowId } = tab;
    if (typeof url !== 'string') {
        throw new TypeError('Cannot found both of `url`');
    }

    const currentSelectedTabsResult = await getSelectedTabsAll(windowId);
    const currentSelectedTabs = unwrapOrFromResult(currentSelectedTabsResult, []);
    if (currentSelectedTabs.length === 0) {
        const result = await saveSingleTab(titleMaybe, url);
        return result;
    }

    const result = await saveMultipleTabs(currentSelectedTabs);
    return result;
}

async function saveSingleTab(
    titleMaybe: Undefinable<string>,
    url: string
): Promise<ReadonlyArray<CreateBookmarkItemResult>> {
    const title = unwrapOrFromUndefinable(titleMaybe, url);
    const created = await createBookmarkItem(url, title);
    return [created];
}

async function saveMultipleTabs(
    currentSelectedTabs: ReadonlyArray<Tab>
): Promise<ReadonlyArray<CreateBookmarkItemResult>> {
    const taskList: Array<Promise<CreateBookmarkItemResult>> = [];
    for (const tab of currentSelectedTabs) {
        const { title: titleMaybe, url } = tab;
        if (typeof url !== 'string') {
            throw new TypeError('Cannot found both of `title` & `url`');
        }
        const title = unwrapOrFromUndefinable(titleMaybe, url);
        const task = createBookmarkItem(url, title);
        taskList.push(task);
    }
    const taskResult = await Promise.allSettled(taskList);
    const successOnly = Ix.filterMap(taskResult, (task) => {
        if (task.status !== 'fulfilled') {
            return null;
        }

        const value = task.value;
        return value;
    });

    const result = Ix.toArray(successOnly);
    return result;
}

async function getSelectedTabsAll(windowId: WindowId): Promise<Result<ReadonlyArray<Tab>, unknown>> {
    const result = await tryCatchIntoResultWithEnsureErrorAsync(async () => {
        // A selected tabs has `.highlighted === true`.
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
        const result: ReadonlyArray<Tab> = await browser.tabs.query({
            highlighted: true,
            windowId,
        });
        return result;
    });
    return result;
}

function onClickSavePage(info: OnClickData, tab: Tab): Promise<CreateBookmarkItemResult> {
    const url = expectNotUndefined(info.pageUrl, 'Cannot found `info.pageUrl`');

    const title = unwrapOrFromUndefinable<string>(tab.title, url);
    const created = createBookmarkItem(url, title);
    return created;
}

function onClickSaveLink(info: OnClickData): Promise<CreateBookmarkItemResult> {
    const url = expectNotUndefined(info.linkUrl, 'Cannot found `info.linkUrl`');

    const title = unwrapOrFromUndefinable(info.linkText, url);
    const created = createBookmarkItem(url, title);
    return created;
}
