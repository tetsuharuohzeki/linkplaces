import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

export class SidebarItemViewModelEntity {

    static create(bookmark: BookmarkTreeNode): SidebarItemViewModelEntity {
        const s = new SidebarItemViewModelEntity(bookmark);
        return s;
    }

    private _bookmark: BookmarkTreeNode;
    private _isOpening: boolean;
    readonly isSelected: boolean;

    private constructor(bookmark: BookmarkTreeNode) {
        this._bookmark = bookmark;
        this._isOpening = false;
        this.isSelected = false;
    }

    get bookmark(): BookmarkTreeNode {
        return this._bookmark;
    }

    get isOpening(): boolean {
        return this._isOpening;
    }

    id(): string {
        return this._bookmark.id;
    }

    setIsOpening(): void {
        this._isOpening = true;
    }
}

export function mapToSidebarItemEntity(bookmark: BookmarkTreeNode): SidebarItemViewModelEntity {
    return SidebarItemViewModelEntity.create(bookmark);
}
