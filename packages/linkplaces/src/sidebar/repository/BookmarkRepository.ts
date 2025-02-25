import type { Repository } from '@linkplaces/foundation';
import { BehaviorSubject, Subject, type Observable } from '@linkplaces/foundation/rx';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';
import type { BookmarkTreeNode, WebExtBookmarkService } from '@linkplaces/webext_types';

type BookmarkId = string;

export class BookmarkRepository implements Repository<Array<BookmarkTreeNode>> {
    static create(bookmarks: WebExtBookmarkService, init: Array<BookmarkTreeNode>): BookmarkRepository {
        const s = new BookmarkRepository(init);

        const callback = () => {
            getUnfiledBoolmarkFolder()
                .then((list) => {
                    s.next(list);
                })
                .catch(console.error);
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
        return this._subject.value();
    }

    next(v: Array<BookmarkTreeNode>): void {
        this._subject.next(v);
    }

    destroy(): void {
        this._onRemoveSubject.unsubscribe();
        this._subject.unsubscribe();
    }

    asObservable(): Observable<Array<BookmarkTreeNode>> {
        return this._subject.asObservable();
    }

    private _onRemoved(id: BookmarkId): void {
        this._onRemoveSubject.next(id);
    }

    onRemovedObservable(): Observable<BookmarkId> {
        return this._onRemoveSubject.asObservable();
    }
}
