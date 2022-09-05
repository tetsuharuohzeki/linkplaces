// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs

import type { LooselyPartial } from './LooselyPartial';
import { RunAt } from './extensionTypes';
import type { WindowId } from './windows';

declare const tabIdMarker: unique symbol;
export type TabId = number & { [tabIdMarker]: never; };

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/Tab
export interface Tab {
    title?: string;
    url?: string;
    id?: TabId;
    windowId: WindowId;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly TAB_ID_NONE: any;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/connect

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create
    create(createProperties: LooselyPartial<{
        active?: boolean;
        cookieStoreId?: string;
        index?: number;
        openerTabId?: number;
        pinned?: boolean;
        url?: string;
        windowId?: number;
    }>): Promise<Readonly<Tab>>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeScript(details: ExecuteScriptDetails): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
    update(updateProperties: TabUpdateArg): Promise<Readonly<Tab>>;
    update(tabId: number, updateProperties: TabUpdateArg): Promise<Readonly<Tab>>;
}

type TabUpdateArg = {
    active?: boolean;
    autoDiscardable?: boolean;
    highlighted?: boolean;
    muted?: boolean;
    openerTabId?: number;
    pinned?: boolean;
    url?: string;
};
