import type { IterableDOMStorageLikeDriver } from './DOMStorageLikeDriver';

export async function dumpAsMap(storage: IterableDOMStorageLikeDriver): Promise<Map<string, string>> {
    const map = new Map();
    const iter = storage.entries();
    for await (const [key, value] of iter) {
        map.set(key, value);
    }
    return map;
}

export async function dumpAsJSON(storage: IterableDOMStorageLikeDriver): Promise<object> {
    const map = await dumpAsMap(storage);
    const result = Object.create(null);
    for (const [key, value] of map.entries()) {
        result[key] = value;
    }
    return result;
}
