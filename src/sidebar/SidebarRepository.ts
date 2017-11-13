import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map as mapIx } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { Observable, Observer, Subject, operators } from 'rxjs';

import { BookmarkTreeNode, WebExtBookmarkService } from '../../typings/webext/bookmarks';

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { Repository } from '../shared/Repository';
import { SidebarItemViewModelEntity, mapToSidebarItemEntity } from './SidebarDomain';
import { Nullable } from 'option-t/esm/Nullable/Nullable';

const { map: mapRx } = operators;

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
        bookmarks.onRemoved.addListener(callback);
        return s;
    }

    private _subject: Subject<Array<BookmarkTreeNode>>;

    private constructor() {
        this._subject = new Subject();
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
        this._subject.unsubscribe();
    }

    asObservable(): Observable<Array<BookmarkTreeNode>> {
        return this._subject;
    }
}

export class SidebarRepository implements Repository<Iterable<SidebarItemViewModelEntity>> {

    static create(bookmarks: WebExtBookmarkService, _init: Array<BookmarkTreeNode>): SidebarRepository {
        const driver = BookmarkRepository.create(bookmarks, _init);
        const s = new SidebarRepository(driver);
        return s;
    }

    private _driver: BookmarkRepository;
    private _obs: Nullable<Observable<IterableX<SidebarItemViewModelEntity>>>;

    private constructor(driver: BookmarkRepository) {
        this._driver = driver;
        this._obs = null;
    }

    destroy(): void {
        this._driver.destroy();
    }

    asObservable(): Observable<IterableX<SidebarItemViewModelEntity>> {
        if (this._obs === null) {
            const o = this._driver.asObservable().pipe(
                mapRx(mapBookmarkTreeNodeToSidebarItemViewModelEntity),
            );
            this._obs = o;
        }
        return this._obs;
    }
}

function mapBookmarkTreeNodeToSidebarItemViewModelEntity(input: Iterable<BookmarkTreeNode>): IterableX<SidebarItemViewModelEntity> {
    const mapper = mapIx(mapToSidebarItemEntity);
    const iter = IterableX.from(input).pipe(mapper);
    return iter;
}
