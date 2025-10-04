import type { Repository } from '@linkplaces/foundation';
import { BehaviorSubject, type Observable } from '@linkplaces/foundation/rx';
import { getUnfiledBoolmarkFolder } from '@linkplaces/shared/bookmark';
import type { BookmarkTreeNode, WebExtBookmarkService } from '@linkplaces/webext_types';

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
        bookmarks.onRemoved.addListener(callback);
        return s;
    }

    private _subject: BehaviorSubject<Array<BookmarkTreeNode>>;

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
        this._subject.unsubscribe();
    }

    asObservable(): Observable<Array<BookmarkTreeNode>> {
        return this._subject.asObservable();
    }
}
