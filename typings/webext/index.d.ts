import { WebExtBookmarkService } from './bookmarks';
import { WebExtRuntimeService } from './runtime';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    runtime: WebExtRuntimeService;
}
