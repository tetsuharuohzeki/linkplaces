import type { Tab, TabId } from './tabs.js';

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/WindowType
export type WindowType = 'normal' | 'popup' | 'panel' | 'devtools';

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/WindowState
export type WindowState = 'normal' | 'minimized' | 'fullscreen' | 'docked';

declare const WindowIdMarker: unique symbol;

export type WindowId = number & {
    readonly [WindowIdMarker]: unknown;
};

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/Window
export interface BrowserWindow {
    alwaysOnTop: boolean;
    focused: boolean;
    height?: number;
    id?: WindowId;
    incognito: boolean;
    left?: number;
    sessionId?: unknown;
    state?: WindowState;
    tabs?: Array<Tab>;
    readonly title?: string;
    top?: number;
    type?: WindowType;
    width?: number;
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows
export interface WebExtWindowsService {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getLastFocused
    getLastFocused(getinfo: {
        populate?: boolean;
        /** @deprecated */
        windowTypes?: Array<WindowType>;
    }): Promise<BrowserWindow>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create
    create(createData: {
        allowScriptsToClose?: boolean;
        cookieStoreId?: boolean;
        focused?: boolean;
        height?: number;
        incognito?: boolean;
        left?: number;
        state?: WindowState;
        tabId?: TabId;
        titlePreface?: string;
        top?: number;
        type?: WindowType;
        url?: string;
        width?: number;
    }): Promise<BrowserWindow>;
}
