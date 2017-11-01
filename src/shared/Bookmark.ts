import { isNull } from 'option-t/esm/Nullable/Nullable';

import {
    BookmarkTreeNode,
    BookmarkTreeNodeItem,
    BookmarkTreeNodeFolder,
    BookmarkTreeNodeSeparator,
} from '../../typings/webext/bookmarks';

export function getUnfiledBoolmarkFolder(): Promise<Array<BookmarkTreeNode>> {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

export async function createBookmarkItem(url: string, title: string): Promise<BookmarkTreeNode> {
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
    // Save to "Other Bookmarks" if there is no `parentId`
    const result = browser.bookmarks.create({
        url,
        title,
    });
    return result;
}

export function removeBookmarkItem(id: string): Promise<void> {
    const r = browser.bookmarks.remove(id);
    return r;
}

export type LinkSchemeType = { isPrivileged: boolean; type: string; };

export function getLinkSchemeType(url: string): LinkSchemeType {
    // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
    const r = /^(chrome|resource|about|data|javascript):/.exec(url);
    if (isNull(r)) {
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
    if (typeof v.type === 'string' && v.type === 'bookmark') {
        return true;
    }

    const is = typeof (v as any).url === 'string'; // tslint:disable-line: no-any
    return is;
}

export function isBookmarkTreeNodeFolder(v: BookmarkTreeNode): v is BookmarkTreeNodeFolder {
    if (typeof v.type === 'string' && v.type === 'folder') {
        return true;
    }

    return (!isBookmarkTreeNodeItem(v) && !isBookmarkTreeNodeSeparator(v));
}

export function isBookmarkTreeNodeSeparator(v: BookmarkTreeNode): v is BookmarkTreeNodeSeparator {
    if (typeof v.type === 'string' && v.type === 'separator') {
        return true;
    }

    return false;
}

