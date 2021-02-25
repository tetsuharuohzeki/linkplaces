import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { Result } from 'option-t/esm/PlainResult/Result';

import type { DOMStorageLikeDriver } from './driver/DOMStorageLikeDriver';

export interface PrefixedStorage<TKeyEnum extends string> {
    readonly driver: DOMStorageLikeDriver;

    get(key: TKeyEnum): Promise<Nullable<string>>;
    set(key: TKeyEnum, val: string): Promise<Result<void, DOMException>>;
    remove(key: TKeyEnum): Promise<void>;
    clear(): Promise<void>;

    getJSON<TValue = unknown>(key: TKeyEnum): Promise<Result<Nullable<TValue>, unknown>>;
    setJSON(key: TKeyEnum, val: unknown): Promise<Result<void, unknown>>;
}

export interface PrefixedStorageEx<TKeyEnum extends string> extends PrefixedStorage<TKeyEnum> {
    getJSON<TValue = unknown>(key: TKeyEnum): Promise<Result<Nullable<TValue>, unknown>>;
    setJSON(key: TKeyEnum, val: unknown): Promise<Result<void, unknown>>;
}
