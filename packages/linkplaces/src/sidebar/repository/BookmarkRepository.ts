import type { Repository } from '@linkplaces/foundation';
import { BehaviorSubject, createObservable, operators, type Observable } from '@linkplaces/foundation/rx';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';
import type { BookmarkTreeNode, WebExtBookmarkService } from '@linkplaces/webext_types';

export class BookmarkRepository implements Repository<Array<BookmarkTreeNode>> {
    static create(bookmarks: WebExtBookmarkService, init: Array<BookmarkTreeNode>): BookmarkRepository {
        const s = new BookmarkRepository(init, bookmarks);
        return s;
    }

    private _subject: BehaviorSubject<Array<BookmarkTreeNode>>;
    private _observable: Observable<Array<BookmarkTreeNode>>;

    private constructor(init: Array<BookmarkTreeNode>, bookmarks: WebExtBookmarkService) {
        this._subject = new BehaviorSubject(init);
        this._observable = createOnChangeBookmarks(bookmarks)
            .pipe(
                operators.switchMap(async (_: unknown) => {
                    const list = await getUnfiledBoolmarkFolder();
                    return list;
                })
            )
            .pipe(operators.connect(this._subject));
    }

    latestValue(): Array<BookmarkTreeNode> {
        return this._subject.value();
    }

    next(v: Array<BookmarkTreeNode>): void {
        this._subject.next(v);
    }

    destroy(): void {
        this._subject.unsubscribe();
    }

    asObservable(): Observable<Array<BookmarkTreeNode>> {
        return this._observable;
    }
}

function createOnChangeBookmarks(bookmarks: WebExtBookmarkService): Observable<unknown> {
    const o = createObservable((destination) => {
        const callback = () => {
            destination.next(undefined);
        };
        bookmarks.onChanged.addListener(callback);
        // bookmarks.onChildrenReordered.addListener(callback); // unimplemted in Firefox
        bookmarks.onMoved.addListener(callback);
        bookmarks.onCreated.addListener(callback);
        bookmarks.onRemoved.addListener(callback);

        destination.addTeardown(() => {
            bookmarks.onChanged.removeListener(callback);
            // bookmarks.onChildrenReordered.removeListener(callback); // unimplemted in Firefox
            bookmarks.onMoved.removeListener(callback);
            bookmarks.onCreated.removeListener(callback);
            bookmarks.onRemoved.removeListener(callback);
        });
    });
    return o;
}
