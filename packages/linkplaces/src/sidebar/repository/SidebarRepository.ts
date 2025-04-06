import { Ix, type Repository } from '@linkplaces/foundation';
import { Subject, type Observable, operators } from '@linkplaces/foundation/rx';
import type { BookmarkTreeNode, WebExtBookmarkService } from '@linkplaces/webext_types';
import type { Nullable } from 'option-t/nullable';
import { type SidebarItemViewModelEntity, mapToSidebarItemEntity } from '../SidebarDomain.js';
import { BookmarkRepository } from './BookmarkRepository.js';

export class SidebarRepository implements Repository<Iterable<SidebarItemViewModelEntity>> {
    static create(bookmarks: WebExtBookmarkService, init: Array<BookmarkTreeNode>): SidebarRepository {
        const driver = BookmarkRepository.create(bookmarks, init);
        const s = new SidebarRepository(driver);
        return s;
    }

    private _driver: BookmarkRepository;
    private _emitter: Subject<Array<BookmarkTreeNode>> = new Subject();
    private _obs: Nullable<Observable<Iterable<SidebarItemViewModelEntity>>> = null;

    private constructor(driver: BookmarkRepository) {
        this._driver = driver;
    }

    destroy(): void {
        this._obs = null;
        this._emitter.unsubscribe();
        this._driver.destroy();
    }

    asObservable(): Observable<Iterable<SidebarItemViewModelEntity>> {
        if (this._obs === null) {
            const o = this._driver.asObservable();
            const input = operators.mergeAll(o, this._emitter.asObservable());
            this._obs = input.pipe(
                operators.map((input) => {
                    const o = mapBookmarkTreeNodeToSidebarItemViewModelEntity(input);
                    return o;
                })
            );
        }
        return this._obs;
    }
}
function mapBookmarkTreeNodeToSidebarItemViewModelEntity(
    input: Iterable<BookmarkTreeNode>
): Iterable<SidebarItemViewModelEntity> {
    const iter = Ix.map(input, mapToSidebarItemEntity);
    return iter;
}
