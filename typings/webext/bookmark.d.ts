// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNodeUnmodifiable
export type BookmarkTreeNodeUnmodifiable = 'managed';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
export type BookmarkTreeNode = BookmarkTreeNodeFolder | BookmarkTreeNodeItem;

interface BookmarkTreeNodeBase {
    readonly id: string;
    readonly parentId?: string;
    readonly index?: number;
    readonly title: string;
    readonly dateAdded?: number;
    readonly dateGroupModified?: number;
    readonly unmodifiable?: BookmarkTreeNodeUnmodifiable;
}

export interface BookmarkTreeNodeItem extends BookmarkTreeNodeBase {
    readonly url: string;
}

export interface BookmarkTreeNodeFolder extends BookmarkTreeNodeBase {
    readonly children: Array<BookmarkTreeNode>;
}
