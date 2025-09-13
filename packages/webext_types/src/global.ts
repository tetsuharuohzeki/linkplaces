import type { ExtensionBrowser } from './ExtensionBrowser.js';
import type { WebExtBookmarkService } from './bookmarks.js';
import type { WebExtBrowserActionService } from './browserAction.js';
import type { WebExtContextMenuService } from './contextMenus.js';
import type { WebExtPageActionService } from './pageAction.js';
import type { WebExtSidebarActionService } from './sidebarAction.js';
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
