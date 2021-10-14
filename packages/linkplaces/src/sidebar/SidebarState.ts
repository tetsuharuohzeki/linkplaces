import type { BookmarkTreeNode } from '@linkplaces/webext_types';

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
