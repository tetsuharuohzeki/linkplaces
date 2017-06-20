// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs

import { RunAt } from './extensionTypes';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/Tab
export interface Tab {
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/WindowType
export type WindowType = 'normal' | 'popup' | 'panel' | 'devtools';

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/TabStatus
export type TabStatus = 'loading' | 'complete';

type ExecuteScriptDetails = {
    allFrames?: boolean;
    code?: string;
    file?: string;
    frameId?: number;
    matchAboutBlank?: boolean;
    runAt?: RunAt;
};

export interface WebExtTabsService {
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/TAB_ID_NONE
    readonly TAB_ID_NONE: any;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/connect

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create
    create(createProperties: {
        active?: boolean;
        cookieStoreId?: string;
        index?: number;
        openerTabId?: number;
        pinned?: boolean;
        url?: string;
        windowId?: number;
    }): Promise<Readonly<Tab>>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript
    executeScript(details: ExecuteScriptDetails): Promise<any>;
    executeScript(tabId: number, details: ExecuteScriptDetails): Promise<any>;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/getCurrent

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
    query(queryInfo: {
        active?: boolean;
        audible?: boolean;
        autoDiscardable?: boolean;
        cookieStoreId?: string;
        currentWindow?: boolean;
        discarded?: boolean;
        highlighted?: boolean;
        index?: number;
        muted?: boolean;
        lastFocusedWindow?: boolean;
        pinned?: boolean;
        status?: TabStatus;
        title?: string;
        url?: string | Array<string>;
        windowId?: number;
        windowType?: WindowType;
    }): Promise<ReadonlyArray<Tab>>;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
}
