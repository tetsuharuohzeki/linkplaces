import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { Result } from 'option-t/esm/PlainResult/Result';

import { PrefixedStorage } from './PrefixedStorage';
import { createPrefixedStorage } from './PrefixedStorageImpl';
import { SchemableStorageWrapper, StorageKey, StorageScheme } from './SchemableStorageWrapper';
import { DOMStorageLikeDriver } from './driver/DOMStorageLikeDriver';

class SchemableStorageWrapperImpl<TStorageSchema extends StorageScheme> implements SchemableStorageWrapper<TStorageSchema> {
    private _driver: PrefixedStorage<StorageKey>;

    constructor(driver: PrefixedStorage<StorageKey>) {
        this._driver = driver;
    }

    get driver(): PrefixedStorage<StorageKey> {
        return this._driver;
    }

    async get<TKey extends Extract<keyof TStorageSchema, string>>(
        key: TKey
    ): Promise<Result<Nullable<TStorageSchema[TKey]>, unknown>> {
        const v = await this._driver.getJSON<TStorageSchema[TKey]>(key);
        return v;
    }

    async set<TKey extends Extract<keyof TStorageSchema, string>>(
        key: TKey,
        val: TStorageSchema[TKey]
    ): Promise<Result<void, unknown>> {
        const v = this._driver.setJSON(key, val);
        return v;
    }

    async remove<TKey extends Extract<keyof TStorageSchema, string>>(key: TKey): Promise<void> {
        const r = this._driver.remove(key);
        return r;
    }

    async clear(): Promise<void> {
        return this._driver.clear();
    }
}

export function createSchemableStorageWrapper<TStorageSchema extends StorageScheme>(
    prefix: string,
    driver: DOMStorageLikeDriver
): SchemableStorageWrapper<TStorageSchema> {
    const prefixed = createPrefixedStorage<StorageKey>(prefix, driver);
    const s = new SchemableStorageWrapperImpl<TStorageSchema>(prefixed);
    return s;
}
