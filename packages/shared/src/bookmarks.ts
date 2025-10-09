import {
    type BookmarkId,
    type BookmarkTreeNode,
    type BookmarkTreeNodeItem,
    type BookmarkTreeNodeFolder,
    type BookmarkTreeNodeSeparator,
    browser,
    type WebExtBookmarkService,
} from '@linkplaces/webext_types';

import { isNull } from 'option-t/nullable';
import { type Result, createErr, createOk, ResultOperator } from 'option-t/plain_result';

const PRIVILEGED_SCHEME_PATTERN = /^(chrome|resource|about|data|javascript):/u;

const UNFILED_BOOKMARK_ID: BookmarkId = 'unfiled_____' as BookmarkId;

export function getUnfiledBoolmarkFolder(bookmarks: WebExtBookmarkService): Promise<Array<BookmarkTreeNode>> {
    // This code only works with Firefox.
    return bookmarks.getChildren(UNFILED_BOOKMARK_ID);
}

function validateUrlForRegister(input: string): Result<string, URIError> {
    let urlString = '';
    // This path accepts an arbitary data which maybe a password or other sensitive data from clipboard.
    // Here, we try to convert them to a valid URL by https://url.spec.whatwg.org/#dom-url-url
    // If the input string is not started with `http`, `https` or other common schecmes, it might be
    //  1. The url which we should not save.
    //  2. The url which we coult not save.
    //
    // This step is false negative. This maybe not a proper way.
    try {
        const url = new URL(input);
        urlString = url.href;
    } catch (cause) {
        // Don't dump the source data to keep it secret.
        const msg = `The input string is not valid URL which is parsible by URL constructor`;
        const e = new URIError(msg, {
            cause,
        });
        return createErr(e);
    }

    if (PRIVILEGED_SCHEME_PATTERN.test(urlString)) {
        // By WebExtensions permission model, we cannot open `about:`
        const msg = `${urlString} is not opend from this extension. Thus this extension does not save this url`;
        const e = new URIError(msg);
        return createErr(e);
    }

    return createOk(urlString);
}

export type CreateBookmarkItemResult = Result<BookmarkTreeNode, Error>;

export async function createBookmarkItem(urlLikeString: string, title: string): Promise<CreateBookmarkItemResult> {
    const validatedUrl = validateUrlForRegister(urlLikeString);
    const result = await ResultOperator.mapAsync(validatedUrl, async (url) => {
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
        // Save to "Other Bookmarks" if there is no `parentId`
        const created = await browser.bookmarks.create({
            url,
            title,
        });
        return created;
    });
    return result;
}

export function removeBookmarkItem(id: BookmarkId): Promise<void> {
    const r = browser.bookmarks.remove(id);
    return r;
}

export interface LinkSchemeType {
    isPrivileged: boolean;
    type: string;
}

export function getLinkSchemeType(url: string): LinkSchemeType {
    // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create
    const r = PRIVILEGED_SCHEME_PATTERN.exec(url);
    if (isNull(r)) {
        return {
            isPrivileged: false,
            type: '',
        };
    }

    const type = r[1];
    if (type === undefined) {
        throw new RangeError('`type` should not be undefined');
    }

    return {
        isPrivileged: true,
        type,
    };
}

export function isBookmarkTreeNodeItem(v: BookmarkTreeNode): v is BookmarkTreeNodeItem {
    if (typeof v.type === 'string' && v.type === 'bookmark') {
        return true;
    }

    return false;
}

export function isBookmarkTreeNodeFolder(v: BookmarkTreeNode): v is BookmarkTreeNodeFolder {
    if (typeof v.type === 'string' && v.type === 'folder') {
        return true;
    }

    return false;
}

export function isBookmarkTreeNodeSeparator(v: BookmarkTreeNode): v is BookmarkTreeNodeSeparator {
    if (typeof v.type === 'string' && v.type === 'separator') {
        return true;
    }

    return false;
}
