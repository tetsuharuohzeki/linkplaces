import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map as mapIx } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { tap as tapIx } from '@reactivex/ix-esnext-esm/iterable/pipe/tap';
import { Observable, Observer, Subject, operators, Subscription } from 'rxjs';
import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { doOnNullable } from 'option-t/esm/Nullable/do';

import { BookmarkTreeNode, WebExtBookmarkService } from '../../typings/webext/bookmarks';

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { Repository } from '../shared/Repository';
import { SidebarItemViewModelEntity, mapToSidebarItemEntity } from './SidebarDomain';

const { map: mapRx, merge: mergeRx, } = operators;

type BookmarkId = string;

export class BookmarkRepository implements Repository<Array<BookmarkTreeNode>>, Observer<Array<BookmarkTreeNode>> {

    static create(bookmarks: WebExtBookmarkService, _init: Array<BookmarkTreeNode>): BookmarkRepository {
        const s = new BookmarkRepository();

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
            s._onRemoved(id);
            callback();
        });
        return s;
    }

    private _subject: Subject<Array<BookmarkTreeNode>>;
    private _onRemoveSubject: Subject<BookmarkId>;

    private constructor() {
        this._subject = new Subject();
        this._onRemoveSubject = new Subject();
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
    private _emitter: Subject<Array<BookmarkTreeNode>>;
    private _lastCache: Nullable<Array<BookmarkTreeNode>>;
    private _obs: Nullable<Observable<IterableX<SidebarItemViewModelEntity>>>;
    private _isOpeningMap: Set<BookmarkId>;
    private _disposer: Subscription;

    private constructor(driver: BookmarkRepository) {
        this._driver = driver;
        this._emitter = new Subject();
        this._lastCache = null;
        this._obs = null;
        this._isOpeningMap = new Set();

        this._disposer = driver.onRemovedObservable().subscribe((id: BookmarkId) => {
            this._unsetIsOpening(id);
        }, console.error);
    }

    destroy(): void {
        this._disposer.unsubscribe();
        this._driver.destroy();
    }

    asObservable(): Observable<IterableX<SidebarItemViewModelEntity>> {
        if (this._obs === null) {
            const original = this._driver.asObservable();
            const o = original.pipe(mergeRx(this._emitter)).pipe(
                mapRx((input) => {
                    this._lastCache = input;
                    const o = mapBookmarkTreeNodeToSidebarItemViewModelEntity(input, this._isOpeningMap);
                    return o;
                }),
            );
            this._obs = o;
        }
        return this._obs;
    }

    setIsOpening(id: BookmarkId): void {
        this._isOpeningMap.add(id);
        doOnNullable(this._lastCache, (lastCache) => {
            this._emitter.next(lastCache);
        });
    }

    private _unsetIsOpening(id: BookmarkId): void {
        this._isOpeningMap.delete(id);
        // after calling this method, driver emit the next values. So we don't invoke this._emitter.
    }
}

function mapBookmarkTreeNodeToSidebarItemViewModelEntity(input: Iterable<BookmarkTreeNode>, isOpeningSet: Set<BookmarkId>): IterableX<SidebarItemViewModelEntity> {
    const mapper = mapIx(mapToSidebarItemEntity);
    const setIsOpening = tapIx({
        next(input: SidebarItemViewModelEntity): void {
            const id = input.bookmark.id;
            const has = isOpeningSet.has(id);
            if (has) {
                input.setIsOpening();
            }
        }
    });
    const iter = IterableX.from(input).pipe(mapper, setIsOpening);
    return iter;
}
