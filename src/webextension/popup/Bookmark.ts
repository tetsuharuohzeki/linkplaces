import { BookmarkTreeNode } from '../../../typings/webext/bookmarks';

export function getUnfiledBoolmarkFolder(): Promise<Array<BookmarkTreeNode>> {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

export function removeBookmarkItem(id: string): Promise<void> {
    const r = browser.bookmarks.remove(id);
    return r;
}

export function isPrivilegedScheme(url: string): boolean {
    // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
    return /^(chrome|about|data|javascript):/.test(url);
}
