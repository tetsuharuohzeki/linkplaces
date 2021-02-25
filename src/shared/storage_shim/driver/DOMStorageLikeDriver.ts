import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import type { Result } from 'option-t/lib/PlainResult//Result';

export type DOMStorageLikeKeysIterableIterator = AsyncIterableIterator<string>;
export type DOMStorageLikeEntriesIterableIterator = AsyncIterableIterator<[string, Nullable<string>]>;

/**
 *  This interface is only for minimum implementation to make a class compat with DOM Storage.
 *  Please keep simple this interface.
 *
 *  If you'd like to access more advanced features, then you should consider to use localForage, other enhanced library,
 *  or implement a way for an actual driver class to provide a direct backend object.
 */
export interface DOMStorageLikeDriver {
    get(key: string): Promise<Nullable<string>>;
    /**
     *  XXX:
     *  This may throw a quota error.
     *
     *  However, in almost case, we cannot handle it correctly when we faceing such error.
     *  Of course, we can remove unnecessary data carefully but it's complex definitedly to handle correctly.
     *  We don't recommend it.
     *  Rather, we recommend to try to clear all data once and try to recover the state from zero.
     *  This includes that show some dialogs to user to clear their storage by user.
     *
     *  Furthermore, for today, we faces a limitation of some privacy enhancements by user-agent
     *  (e.g. Safari's Intelligent Tracking Prevention which will remove a page's all persistent data after some periods).
     *
     *  This suggests these characteristics additionally to traditional security concersn related to client-side storage.
     *
     *      1. We cannot expect that user's storage is long-lived persistecy.
     *         Perhaps, they're just only little longer than sessionStorage.
     *      2. We should think the user's storage would clear accidentally.
     *         Be careful if we store high volatile credentials to them.
     *          - Of course, DOM Storage is not secure to store security credentials!
     *          - We might not be able to recover them even if user call your support.
     */
    set(key: string, value: string): Promise<Result<void, DOMException>>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}

export interface IterableDOMStorageLikeDriver extends DOMStorageLikeDriver {
    keys(): DOMStorageLikeKeysIterableIterator;
    entries(): DOMStorageLikeEntriesIterableIterator;
}
