import type { WebExtBookmarkService } from './bookmarks.js';
import type { WebExtBrowserActionService } from './browser_action.js';
import type { WebExtContextMenuService } from './context_menus.js';
import type { ExtensionBrowser } from './extension_browser.js';
import type { WebExtPageActionService } from './page_action.js';
import type { WebExtSidebarActionService } from './sidebar_action.js';
import type { WebExtTabsService } from './tabs.js';
import type { WebExtWindowsService } from './windows.js';

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    browserAction: WebExtBrowserActionService;
    menus: WebExtContextMenuService;
    pageAction: WebExtPageActionService;
    sidebarAction: WebExtSidebarActionService;
    tabs: WebExtTabsService;
    windows: WebExtWindowsService;
}

export type WebExtGlobalNamespace = WebExtGlobal & ExtensionBrowser;

export const browser: WebExtGlobalNamespace =
    // @ts-expect-error
    globalThis.browser;
export const chrome: WebExtGlobalNamespace =
    // @ts-expect-error
    globalThis.chrome;
