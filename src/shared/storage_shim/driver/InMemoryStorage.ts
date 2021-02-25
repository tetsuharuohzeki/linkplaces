import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { createOk, Result } from 'option-t/esm/PlainResult/Result';

import type {
    IterableDOMStorageLikeDriver,
    DOMStorageLikeEntriesIterableIterator,
    DOMStorageLikeKeysIterableIterator,
} from './DOMStorageLikeDriver';

class InMemoryStorage implements IterableDOMStorageLikeDriver {
    private _backend: Map<string, string>;

    constructor() {
        this._backend = new Map();
    }

    async get(key: string): Promise<Nullable<string>> {
        const val = this._backend.get(key);
        if (val === undefined) {
            return null;
        }

        return val;
    }

    async set(key: string, value: string): Promise<Result<void, DOMException>> {
        this._backend.set(key, value);
        return createOk(undefined);
    }

    async remove(key: string): Promise<void> {
        this._backend.delete(key);
    }

    async clear(): Promise<void> {
        this._backend.clear();
    }

    keys(): DOMStorageLikeKeysIterableIterator {
        const iter = iterateKeysOverMap(this._backend);
        return iter;
    }

    entries(): DOMStorageLikeEntriesIterableIterator {
        const iter = iterateEntriesOverMap(this._backend);
        return iter;
    }
}

async function* iterateKeysOverMap(map: Map<string, string>): AsyncGenerator<string> {
    for (const k of map.keys()) {
        yield k;
    }
}

async function* iterateEntriesOverMap(map: Map<string, string>): AsyncGenerator<[string, Nullable<string>]> {
    for (const entry of map.entries()) {
        yield entry;
    }
}

export function createInMemoryStorage(): IterableDOMStorageLikeDriver {
    const s = new InMemoryStorage();
    return s;
}
