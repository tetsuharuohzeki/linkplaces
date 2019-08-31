import { WebExtBookmarkService } from './bookmarks';
import { WebExtBrowserActionService } from './browserAction';
import { WebExtContextMenuService } from './contextMenus';
import { WebExtExtensionService } from './extension';
import { WebExtPageActionService } from './pageAction';
import { WebExtRuntimeService } from './runtime';
import { WebExtSidebarActionService } from './sidebarAction';
import { WebExtTabsService } from './tabs';
import { WebExtWindowsService } from './windows';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    browserAction: WebExtBrowserActionService;
    menus: WebExtContextMenuService;
    extension: WebExtExtensionService;
    pageAction: WebExtPageActionService;
    runtime: WebExtRuntimeService;
    sidebarAction: WebExtSidebarActionService;
    tabs: WebExtTabsService;
    windows: WebExtWindowsService;
}
