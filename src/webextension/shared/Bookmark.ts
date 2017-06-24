import {
    BookmarkTreeNode,
    BookmarkTreeNodeItem,
} from '../../../typings/webext/bookmarks';

export function getUnfiledBoolmarkFolder(): Promise<Array<BookmarkTreeNode>> {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

export function removeBookmarkItem(id: string): Promise<void> {
    const r = browser.bookmarks.remove(id);
    return r;
}

export type LinkSchemeType = { isPrivileged: boolean; type: string; };

export function getLinkSchemeType(url: string): LinkSchemeType {
    // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
    const r = /^(chrome|about|data|javascript):/.exec(url);
    if (r === null) {
        return {
            isPrivileged: false,
            type: '',
        };
    }

    const [,type] = r;
    return {
        isPrivileged: true,
        type,
    };
}

export function isBookmarkTreeNodeItem(v: BookmarkTreeNode): v is BookmarkTreeNodeItem {
    const is = typeof (v as any).url === 'string';
    return is;
}
