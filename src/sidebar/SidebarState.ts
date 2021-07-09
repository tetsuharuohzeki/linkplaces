import type { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import * as Ix from '../foundation/ix/mod';
import { mapToSidebarItemEntity, SidebarItemViewModelEntity } from './SidebarDomain';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

export function createInitialSidebarState(source: Array<BookmarkTreeNode> = []): SidebarState {
    const list = Ix.map(source, mapToSidebarItemEntity);
    const initialState: Readonly<SidebarState> = {
        list,
    };
    return initialState;
}
