import { BookmarkTreeNode } from '../../../typings/webext/bookmarks';

export interface SidebarState {
    list: ReadonlyArray<BookmarkTreeNode>;
}
