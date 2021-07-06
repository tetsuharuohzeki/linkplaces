import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';
import { mapToSidebarItemEntity, SidebarItemViewModelEntity } from './SidebarDomain';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

export function createInitialSidebarState(list: Array<BookmarkTreeNode> = []): SidebarState {
    const initialState: Readonly<SidebarState> = {
        list: list.map(mapToSidebarItemEntity),
    };
    return initialState;
}
