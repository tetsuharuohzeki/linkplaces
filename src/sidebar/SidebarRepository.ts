import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map as mapIx } from '@reactivex/ix-esnext-esm/iterable/pipe/map';

import {
    BehaviorSubject,
    Observable,
    Observer,
    Subject,
    Subscription,
    merge as mergeRx,
} from 'rxjs';
import {
    map as mapRx,
} from 'rxjs/operators';

import { Nullable } from 'option-t/esm/Nullable/Nullable';

import { BookmarkTreeNode, WebExtBookmarkService } from '../../typings/webext/bookmarks';

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { Repository } from '../shared/Repository';
import { SidebarItemViewModelEntity, mapToSidebarItemEntity } from './SidebarDomain';

type BookmarkId = string;

export class BookmarkRepository implements Repository<Array<BookmarkTreeNode>>, Observer<Array<BookmarkTreeNode>> {

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
    private _onRemoveSubject: Subject<BookmarkId>;

    private constructor(init: Array<BookmarkTreeNode>) {
        this._subject = new BehaviorSubject(init);
        this._onRemoveSubject = new Subject();
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
    private _emitter: Subject<Array<BookmarkTreeNode>>;
    private _obs: Nullable<Observable<IterableX<SidebarItemViewModelEntity>>>;
    private _disposer: Subscription;

    private constructor(driver: BookmarkRepository) {
        this._driver = driver;
        this._emitter = new Subject();
        this._obs = null;

        this._disposer = new Subscription();
    }

    destroy(): void {
        this._disposer.unsubscribe();
        this._obs = null;
        this._emitter.unsubscribe();
        this._driver.destroy();
    }

    asObservable(): Observable<IterableX<SidebarItemViewModelEntity>> {
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

function mapBookmarkTreeNodeToSidebarItemViewModelEntity(input: Iterable<BookmarkTreeNode>): IterableX<SidebarItemViewModelEntity> {
    const mapper = mapIx(mapToSidebarItemEntity);
    const iter = IterableX.from(input).pipe(mapper);
    return iter;
}
