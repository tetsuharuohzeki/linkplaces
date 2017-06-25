import { FullListener } from './event';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks
export interface WebExtBookmarkService {
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
    create(bookmark: CreateDetails): Promise<BookmarkTreeNode>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/get
    get(idOrIdList: string | Array<string>): Promise<Array<BookmarkTreeNode>>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getChildren
    getChildren(id: string): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getRecent

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getSubTree
    getSubTree(id: string): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/getTree
    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/move

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/remove
    remove(id: string): Promise<void>;
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/removeTree
    removeTree(id: string): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/search
    search(query: {
        query?: string;
        url?: string;
        title?: string;
    }): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/update
    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onCreated
    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onRemoved

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChanged
    onChanged: FullListener<(id: string, changeInfo: OnChangeInfo) => void>;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onMoved
    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChildrenReordered
    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportBegan
    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportEnded
}

export type OnChangeInfo = Readonly<{title: string; url?: string; }>;

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

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/CreateDetails
export type CreateDetails = {
    parentId?: string;
    index?: number;
    title?: string;
    url?: string | null;
};
