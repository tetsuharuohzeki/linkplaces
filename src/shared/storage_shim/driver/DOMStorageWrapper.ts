import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { Result, createOk, createErr } from 'option-t/lib/PlainResult//Result';

import type {
    IterableDOMStorageLikeDriver,
    DOMStorageLikeEntriesIterableIterator,
    DOMStorageLikeKeysIterableIterator,
} from './DOMStorageLikeDriver';

class DOMStorageWrapper implements IterableDOMStorageLikeDriver {
    private _backend: Storage;

    constructor(backend: Storage) {
        this._backend = backend;
    }

    async get(key: string): Promise<Nullable<string>> {
        const val = this._backend.getItem(key);
        return val;
    }

    async set(key: string, value: string): Promise<Result<void, DOMException>> {
        try {
            this._backend.setItem(key, value);
        } catch (e: unknown) {
            if (e instanceof DOMException) {
                const err = createErr(e);
                return err;
            }

            throw e;
        }

        return createOk<void>(undefined);
    }

    async remove(key: string): Promise<void> {
        this._backend.removeItem(key);
    }

    async clear(): Promise<void> {
        this._backend.clear();
    }

    keys(): DOMStorageLikeKeysIterableIterator {
        const iter = iterateKeysOverDOMStorage(this._backend);
        return iter;
    }

    entries(): DOMStorageLikeEntriesIterableIterator {
        const iter = iterateEntriesOverDOMStorage(this._backend);
        return iter;
    }
}

async function* iterateKeysOverDOMStorage(s: Storage): AsyncGenerator<string> {
    for (let i = 0, l = s.length; i < l; ++i) {
        const key = s.key(i);
        if (key === null) {
            return;
        }
        yield key;
    }
}

async function* iterateEntriesOverDOMStorage(s: Storage): AsyncGenerator<[string, Nullable<string>]> {
    const keys = iterateKeysOverDOMStorage(s);
    for await (const k of keys) {
        const val = s.getItem(k);
        yield [k, val];
    }
}

export function createDOMStorageWrapper(s: Storage): IterableDOMStorageLikeDriver {
    const w = new DOMStorageWrapper(s);
    return w;
}

export function castToIterableDOMStorageLikeDriver(base: unknown): Nullable<IterableDOMStorageLikeDriver> {
    if (base instanceof DOMStorageWrapper) {
        return base;
    }

    return null;
}
