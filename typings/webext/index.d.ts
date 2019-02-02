import { WebExtBookmarkService } from './bookmarks';
import { WebExtBrowserActionService } from './browserAction';
import { WebExtContextMenuService } from './contextMenus';
import { WebExtExtensionService } from './extension';
import { WebExtPageActionService } from './pageAction';
import { WebExtRuntimeService } from './runtime';
import { WebExtSidebarActionService } from './sidebarAction';
import { WebExtTabsService } from './tabs';

declare global {
    // eslint-disable-next-line init-declarations
    const browser: WebExtGlobal;
    // eslint-disable-next-line init-declarations
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    browserAction: WebExtBrowserActionService;
    contextMenus: WebExtContextMenuService;
    extension: WebExtExtensionService;
    pageAction: WebExtPageActionService;
    runtime: WebExtRuntimeService;
    sidebarAction: WebExtSidebarActionService;
    tabs: WebExtTabsService;
}
