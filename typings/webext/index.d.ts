import type { ExtensionBrowser } from './ExtensionBrowser';
import { WebExtBookmarkService } from './bookmarks';
import { WebExtBrowserActionService } from './browserAction';
import { WebExtContextMenuService } from './contextMenus';
import { WebExtExtensionService } from './extension';
import { WebExtPageActionService } from './pageAction';
import { WebExtSidebarActionService } from './sidebarAction';
import { WebExtTabsService } from './tabs';
import { WebExtWindowsService } from './windows';


declare global {
    const browser: WebExtGlobal & ExtensionBrowser;
    const chrome: WebExtGlobal & ExtensionBrowser;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    browserAction: WebExtBrowserActionService;
    menus: WebExtContextMenuService;
    extension: WebExtExtensionService;
    pageAction: WebExtPageActionService;
    sidebarAction: WebExtSidebarActionService;
    tabs: WebExtTabsService;
    windows: WebExtWindowsService;
}
