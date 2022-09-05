import type { ExtensionBrowser } from './ExtensionBrowser.js';
import { WebExtBookmarkService } from './bookmarks.js';
import { WebExtBrowserActionService } from './browserAction.js';
import { WebExtContextMenuService } from './contextMenus.js';
import { WebExtPageActionService } from './pageAction.js';
import { WebExtSidebarActionService } from './sidebarAction.js';
import { WebExtTabsService } from './tabs.js';
import { WebExtWindowsService } from './windows.js';


declare global {
    const browser: WebExtGlobal & ExtensionBrowser;
    const chrome: WebExtGlobal & ExtensionBrowser;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    browserAction: WebExtBrowserActionService;
    menus: WebExtContextMenuService;
    pageAction: WebExtPageActionService;
    sidebarAction: WebExtSidebarActionService;
    tabs: WebExtTabsService;
    windows: WebExtWindowsService;
}
