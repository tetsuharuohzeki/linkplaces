import { WebExtBookmarkService } from './bookmarks';
import { WebExtContextMenuService } from './contextMenus';
import { WebExtRuntimeService } from './runtime';
import { WebExtTabsService } from './tabs';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    contextMenus: WebExtContextMenuService;
    runtime: WebExtRuntimeService;
    tabs: WebExtTabsService;
}
