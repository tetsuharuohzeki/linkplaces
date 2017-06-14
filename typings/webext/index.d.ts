import { WebExtBookmarkService } from './bookmarks';
import { Runtime } from './runtime';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    bookmarks: WebExtBookmarkService;
    runtime: Runtime;
}
