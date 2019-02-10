import { Result, createErr, createOk } from 'option-t/esm/PlainResult/Result';
import { isNull } from 'option-t/esm/Nullable/Nullable';

import {
    BookmarkTreeNode,
    BookmarkTreeNodeItem,
    BookmarkTreeNodeFolder,
    BookmarkTreeNodeSeparator,
} from '../../typings/webext/bookmarks';

const PRIVILEGED_SCHEME_PATTERN = /^(chrome|resource|about|data|javascript):/u;

export function getUnfiledBoolmarkFolder(): Promise<Array<BookmarkTreeNode>> {
    // This code only works with Firefox.
    return browser.bookmarks.getChildren('unfiled_____');
}

export async function createBookmarkItem(url: string, title: string): Promise<Result<BookmarkTreeNode, Error>> {
    if (PRIVILEGED_SCHEME_PATTERN.test(url)) {
        // By WebExtensions permission model, we cannot open `about:`
        const msg = `${url} is not opend from this extension. Thus this extension does not save this url`;
        const e = createErr(new URIError(msg));
        return e;
    }

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
    // Save to "Other Bookmarks" if there is no `parentId`
    const result = await browser.bookmarks.create({
        url,
        title,
    });
    return createOk(result);
}

export function removeBookmarkItem(id: string): Promise<void> {
    const r = browser.bookmarks.remove(id);
    return r;
}

export type LinkSchemeType = { isPrivileged: boolean; type: string; };

export function getLinkSchemeType(url: string): LinkSchemeType {
    // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
    const r = PRIVILEGED_SCHEME_PATTERN.exec(url);
    if (isNull(r)) {
        return {
            isPrivileged: false,
            type: '',
        };
    }

    const [, type] = r;
    return {
        isPrivileged: true,
        type,
    };
}

export function isBookmarkTreeNodeItem(v: BookmarkTreeNode): v is BookmarkTreeNodeItem {
    if (typeof v.type === 'string' && v.type === 'bookmark') {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const is = typeof (v as any).url === 'string';
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

