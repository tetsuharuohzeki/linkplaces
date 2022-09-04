import { createBookmarkItem } from '@linkplaces/shared/bookmark';
import type { BookmarkTreeNode, OnClickData, CreateArgument, ContextType, Tab } from '@linkplaces/webext_types';

import { Maybe, isNullOrUndefined } from 'option-t/Maybe';
import type { Result } from 'option-t/PlainResult/Result';
import { inspectErrOfResult } from 'option-t/PlainResult/inspect';
import { expectNotUndefined } from 'option-t/Undefinable/expect';
import { unwrapOrFromUndefinable } from 'option-t/Undefinable/unwrapOr';

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

export function setupContextMenus(browser: typeof chrome): void {
    browser.menus.onClicked.addListener(onClicked);

    // [By the backgroun page doc on MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts),
    // an extension should use `browser.runtime.onInstalled` to register a menu
    // But this code only works once after user install extension
    // on [Firefox 106.0a1](https://hg.mozilla.org/mozilla-central/rev/c731914e80964349114e473544e7a7165cae3cc1)
    // So we need place this intializer in the top level scope even if the background page is non-persistent.
    createContextMenu(browser);
}

function createContextMenu(browser: typeof chrome): void {
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
    browser.menus.onClicked.removeListener(onClicked);
    return browser.menus.removeAll();
}

function onClicked(info: OnClickData, tab: Maybe<Tab>): void {
    let saving: Promise<Result<BookmarkTreeNode, Error>>;
    switch (info.menuItemId) {
        case CTXMENU_ID_TAB_SAVE_TAB: {
            if (isNullOrUndefined(tab)) {
                throw new TypeError('could not find `tab`');
            }
            saving = onClickSaveTab(tab);
            break;
        }
        case CTXMENU_ID_CONTENT_SAVE_PAGE: {
            if (isNullOrUndefined(tab)) {
                throw new TypeError('could not find `tab`');
            }
            saving = onClickSavePage(info, tab);
            break;
        }
        case CTXMENU_ID_LINK_SAVE_LINK: {
            saving = onClickSaveLink(info);
            break;
        }
        default:
            throw new RangeError(`unexpected \`info.menuItemId\`. info: ${JSON.stringify(info)}`);
    }

    saving
        .then((result) => {
            inspectErrOfResult(result, console.error);
        })
        .catch(console.error);
}

function onClickSaveTab(tab: Tab): Promise<Result<BookmarkTreeNode, Error>> {
    const { title, url } = tab;
    if (typeof title !== 'string' || typeof url !== 'string') {
        throw new TypeError('Cannot found both of `title` & `url`');
    }

    const created = createBookmarkItem(url, title);
    return created;
}

function onClickSavePage(info: OnClickData, tab: Tab): Promise<Result<BookmarkTreeNode, Error>> {
    const url = expectNotUndefined(info.pageUrl, 'Cannot found `info.pageUrl`');

    const title = unwrapOrFromUndefinable<string>(tab.title, url);
    const created = createBookmarkItem(url, title);
    return created;
}

function onClickSaveLink(info: OnClickData): Promise<Result<BookmarkTreeNode, Error>> {
    const url = expectNotUndefined(info.linkUrl, 'Cannot found `info.linkUrl`');

    const title = unwrapOrFromUndefinable(info.linkText, url);
    const created = createBookmarkItem(url, title);
    return created;
}
