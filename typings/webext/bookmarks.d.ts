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

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onCreated
    onCreated: FullListener<(id: string, bookmark: BookmarkTreeNode) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onRemoved
    onRemoved: FullListener<(id: string, removeInfo: OnRemoveInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChanged
    onChanged: FullListener<(id: string, changeInfo: OnChangeInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onMoved
    onMoved: FullListener<(id: string, moveInfo: OnMoveInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChildrenReordered
    onChildrenReordered: FullListener<(id: string, reorderInfo: OnReorderInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportBegan
    onImportBegan: FullListener<() => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportEnded
    onImportEnded: FullListener<() => void>;
}

export type OnRemoveInfo = Readonly<{
    parentId: string;
    index: number;
    node: BookmarkTreeNode;
}>;
export type OnChangeInfo = Readonly<{
    title: string;
    url?: string;
}>;
export type OnMoveInfo = Readonly<{
    parentId: string;
    index: number;
    oldParentId: string;
    oldIndex: number;
}>;
export type OnReorderInfo = Readonly<{
    childIds: Array<string>;
}>;

export enum BookmarkTreeNodeType {
    Bookmark = 'bookmark',
    Folder = 'folder',
    Separator = 'separator',
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNodeUnmodifiable
export type BookmarkTreeNodeUnmodifiable = 'managed';

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
export type BookmarkTreeNode = BookmarkTreeNodeFolder | BookmarkTreeNodeItem | BookmarkTreeNodeSeparator;

interface BookmarkTreeNodeBase {
    readonly id: string;
    readonly parentId?: string;
    readonly index?: number;
    readonly title: string;
    readonly dateAdded?: number;
    readonly dateGroupModified?: number;
    readonly unmodifiable?: BookmarkTreeNodeUnmodifiable;
    readonly type?: BookmarkTreeNodeType;
}

export interface BookmarkTreeNodeItem extends BookmarkTreeNodeBase {
    readonly url: string;
    readonly type?: BookmarkTreeNodeType.Bookmark;
}

export interface BookmarkTreeNodeFolder extends BookmarkTreeNodeBase {
    readonly children: Array<BookmarkTreeNode>;
    readonly type?: BookmarkTreeNodeType.Folder;
}

export interface BookmarkTreeNodeSeparator extends BookmarkTreeNodeBase {
    readonly type?: BookmarkTreeNodeType.Separator;
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/CreateDetails
export type CreateDetails = {
    parentId?: string;
    index?: number;
    title?: string;
    url?: string | null;
};
