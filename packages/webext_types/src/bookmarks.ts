import type { ExtensionEventManager } from './ExtensionEventManager.js';

declare const bookmarkIdMarker: unique symbol;
export type BookmarkId = string & { [bookmarkIdMarker]: never };

export type BookmarkOnChangedEventListener = (id: BookmarkId, changeInfo: OnChangeInfo) => void;

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks
export interface WebExtBookmarkService {
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/create
    create(bookmark: CreateDetails): Promise<BookmarkTreeNode>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/get
    get(idOrIdList: BookmarkId | Array<BookmarkId>): Promise<Array<BookmarkTreeNode>>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getChildren
    getChildren(id: BookmarkId): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getRecent

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/getSubTree
    getSubTree(id: BookmarkId): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/getTree
    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/move

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/remove
    remove(id: BookmarkId): Promise<void>;
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/removeTree
    removeTree(id: BookmarkId): Promise<void>;

    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/search
    search(query: { query?: string; url?: string; title?: string }): Promise<Array<BookmarkTreeNode>>;

    // TODO: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/update

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onCreated
    onCreated: ExtensionEventManager<(id: BookmarkId, bookmark: BookmarkTreeNode) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onRemoved
    onRemoved: ExtensionEventManager<(id: BookmarkId, removeInfo: OnRemoveInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChanged
    onChanged: ExtensionEventManager<BookmarkOnChangedEventListener>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onMoved
    onMoved: ExtensionEventManager<(id: BookmarkId, moveInfo: OnMoveInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onChildrenReordered
    onChildrenReordered: ExtensionEventManager<(id: BookmarkId, reorderInfo: OnReorderInfo) => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportBegan
    onImportBegan: ExtensionEventManager<() => void>;

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/onImportEnded
    onImportEnded: ExtensionEventManager<() => void>;
}

export type OnRemoveInfo = Readonly<{
    parentId: BookmarkId;
    index: number;
    node: BookmarkTreeNode;
}>;
export type OnChangeInfo = Readonly<{
    title: string;
    url?: string;
}>;
export type OnMoveInfo = Readonly<{
    parentId: BookmarkId;
    index: number;
    oldParentId: BookmarkId;
    oldIndex: number;
}>;
export type OnReorderInfo = Readonly<{
    childIds: Array<BookmarkId>;
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
    readonly id: BookmarkId;
    readonly parentId?: BookmarkId;
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
    parentId?: BookmarkId;
    index?: number;
    title?: string;
    url?: string | null;
};
