import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { Result, createErr, createOk, isErr } from 'option-t/esm/PlainResult/Result';
import { unwrapFromResult } from 'option-t/esm/PlainResult/unwrap';

import { PrefixedStorage } from './PrefixedStorage';
import type { DOMStorageLikeDriver } from './driver/DOMStorageLikeDriver';

function parseJSON<TValue = unknown>(raw: string): Result<TValue, unknown> {
    let val: TValue;
    try {
        val = JSON.parse(raw);
    } catch (e: unknown) {
        return createErr(e);
    }

    return createOk(val);
}

function stringifyJSON(raw: unknown): Result<string, unknown> {
    let s: string;
    try {
        s = JSON.stringify(raw);
    } catch (e: unknown) {
        return createErr(e);
    }

    return createOk(s);
}

function computeKey(prefix: string, key: string): string {
    return prefix + ':' + key;
}

class PrefixedStorageImpl<TKeyEnum extends string> implements PrefixedStorage<TKeyEnum> {
    private readonly _prefix: string;
    private _driver: DOMStorageLikeDriver;

    constructor(prefix: string, driver: DOMStorageLikeDriver) {
        this._prefix = prefix;
        this._driver = driver;
    }

    get driver(): DOMStorageLikeDriver {
        return this._driver;
    }

    async get(key: TKeyEnum): Promise<Nullable<string>> {
        const actualKey = computeKey(this._prefix, key);
        const v = this._driver.get(actualKey);
        return v;
    }

    async set(key: TKeyEnum, val: string): Promise<Result<void, DOMException>> {
        const actualKey = computeKey(this._prefix, key);
        const v = this._driver.set(actualKey, val);
        return v;
    }

    async remove(key: TKeyEnum): Promise<void> {
        const actualKey = computeKey(this._prefix, key);
        const r = this._driver.remove(actualKey);
        return r;
    }

    async clear(): Promise<void> {
        return this._driver.clear();
    }

    async getJSON<TValue = unknown>(key: TKeyEnum): Promise<Result<Nullable<TValue>, unknown>> {
        const v = await this.get(key);
        if (v === null) {
            return createOk(null);
        }

        const parsed = parseJSON<TValue>(v);
        return parsed;
    }

    async setJSON(key: TKeyEnum, val: unknown): Promise<Result<void, unknown>> {
        const input = stringifyJSON(val);
        if (isErr(input)) {
            return input;
        }

        const valString = unwrapFromResult(input);
        const r = await this.set(key, valString);
        return r;
    }
}

export function createPrefixedStorage<TKeyEnum extends string>(
    prefix: string,
    driver: DOMStorageLikeDriver
): PrefixedStorage<TKeyEnum> {
    const s = new PrefixedStorageImpl(prefix, driver);
    return s;
}
