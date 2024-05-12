import type { BookmarkTreeNode } from '@linkplaces/webext_types';

export class SidebarItemViewModelEntity {
    static create(bookmark: BookmarkTreeNode): SidebarItemViewModelEntity {
        const s = new SidebarItemViewModelEntity(bookmark);
        return s;
    }

    private _bookmark: BookmarkTreeNode;

    private constructor(bookmark: BookmarkTreeNode) {
        this._bookmark = bookmark;
    }

    get bookmark(): BookmarkTreeNode {
        return this._bookmark;
    }

    id(): string {
        return this._bookmark.id;
    }
}

export function mapToSidebarItemEntity(bookmark: BookmarkTreeNode): SidebarItemViewModelEntity {
    return SidebarItemViewModelEntity.create(bookmark);
}
