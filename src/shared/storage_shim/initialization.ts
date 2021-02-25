import { isOk } from 'option-t/esm/PlainResult/Result';
import { unwrapFromResult } from 'option-t/esm/PlainResult/unwrap';
import { createInMemoryStorage, createLocalStorage, createSessionStorage, DOMStorageLikeDriver } from './driver/mod';

export async function createLocalStorageWithFallback(keyPrefix: string): Promise<DOMStorageLikeDriver> {
    const real = await createLocalStorage(keyPrefix);
    if (isOk(real)) {
        const actuial = unwrapFromResult(real);
        return actuial;
    }

    const fallback = createInMemoryStorage();
    return fallback;
}

export async function createSessionStorageWithFallback(keyPrefix: string): Promise<DOMStorageLikeDriver> {
    const real = await createSessionStorage(keyPrefix);
    if (isOk(real)) {
        const actuial = unwrapFromResult(real);
        return actuial;
    }

    const fallback = createInMemoryStorage();
    return fallback;
}
