import { Observable, Observer, Subject } from 'rxjs';

import { BookmarkTreeNode, WebExtBookmarkService } from '../../../typings/webext/bookmarks';

import { getUnfiledBoolmarkFolder } from '../shared/Bookmark';
import { Repository } from '../shared/Repository';

export class SidebarRepository implements Repository<Array<BookmarkTreeNode>>, Observer<Array<BookmarkTreeNode>> {

        static create(bookmarks: WebExtBookmarkService, _init: Array<BookmarkTreeNode>): SidebarRepository {
            const s = new SidebarRepository();

            const callback = () => {
                getUnfiledBoolmarkFolder().then((list) => {
                    s.next(list);
                }).catch(console.error);
            };
            bookmarks.onChanged.addListener(callback);
            bookmarks.onChildrenReordered.addListener(callback);
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
