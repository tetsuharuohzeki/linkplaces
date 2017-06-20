import { WebExtBookmarkService } from './bookmarks';
import { WebExtRuntimeService } from './runtime';
import { WebExtTabsService } from './tabs';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    runtime: WebExtRuntimeService;
    tabs: WebExtTabsService;
}
