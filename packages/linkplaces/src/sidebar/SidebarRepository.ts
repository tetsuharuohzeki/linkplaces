import { Ix, type Repository } from '@linkplaces/foundation';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';
import type { BookmarkTreeNode, WebExtBookmarkService } from '@linkplaces/webext_types';

import type { Nullable } from 'option-t/Nullable/Nullable';
import {
    BehaviorSubject,
    Observable,
    Subject,
    merge as mergeRx,
    map as mapRx,
} from 'rxjs';

import { SidebarItemViewModelEntity, mapToSidebarItemEntity } from './SidebarDomain.js';

type BookmarkId = string;

export class BookmarkRepository implements Repository<Array<BookmarkTreeNode>> {

    static create(bookmarks: WebExtBookmarkService, init: Array<BookmarkTreeNode>): BookmarkRepository {
        const s = new BookmarkRepository(init);

        const callback = () => {
            getUnfiledBoolmarkFolder().then((list) => {
                s.next(list);
            }).catch(console.error);
        };
        bookmarks.onChanged.addListener(callback);
        // bookmarks.onChildrenReordered.addListener(callback); // unimplemted in Fireofxma
        bookmarks.onMoved.addListener(callback);
        bookmarks.onCreated.addListener(callback);
        bookmarks.onRemoved.addListener((id: BookmarkId, _info) => {
            // eslint-disable-next-line no-underscore-dangle
            s._onRemoved(id);
            callback();
        });
        return s;
    }

    private _subject: BehaviorSubject<Array<BookmarkTreeNode>>;
    private _onRemoveSubject: Subject<BookmarkId> = new Subject();

    private constructor(init: Array<BookmarkTreeNode>) {
        this._subject = new BehaviorSubject(init);
    }

    latestValue(): Array<BookmarkTreeNode> {
        return this._subject.getValue();
    }

    next(v: Array<BookmarkTreeNode>): void {
        this._subject.next(v);
    }

    error(v: Array<BookmarkTreeNode>): void {
        this._subject.error(v);
    }

    complete(): void {
        this._subject.complete();
    }

    destroy(): void {
        this._onRemoveSubject.unsubscribe();
        this._subject.unsubscribe();
    }

    asObservable(): Observable<Array<BookmarkTreeNode>> {
        return this._subject;
    }

    private _onRemoved(id: BookmarkId): void {
        this._onRemoveSubject.next(id);
    }

    onRemovedObservable(): Observable<BookmarkId> {
        return this._onRemoveSubject.asObservable();
    }
}

export class SidebarRepository implements Repository<Iterable<SidebarItemViewModelEntity>> {

    static create(bookmarks: WebExtBookmarkService, _init: Array<BookmarkTreeNode>): SidebarRepository {
        const driver = BookmarkRepository.create(bookmarks, _init);
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
            const input = mergeRx(o, this._emitter);
            this._obs = input.pipe(
                mapRx((input) => {
                    const o = mapBookmarkTreeNodeToSidebarItemViewModelEntity(input);
                    return o;
                }),
            );
        }
        return this._obs;
    }
}

function mapBookmarkTreeNodeToSidebarItemViewModelEntity(input: Iterable<BookmarkTreeNode>): Iterable<SidebarItemViewModelEntity> {
    const iter = Ix.map(input, mapToSidebarItemEntity);
    return iter;
}
