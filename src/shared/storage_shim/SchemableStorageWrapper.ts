import type { Nullable } from 'option-t/esm/Nullable/Nullable';
import { Result } from 'option-t/esm/PlainResult/Result';

import { JsonableValue } from './JsonableValue';
import { PrefixedStorage } from './PrefixedStorage';

export type StorageKey = string;

export type StorageScheme = Record<string, JsonableValue> & {
    // We recommend to specify version field to migration.
    version: number;
};

export interface SchemableStorageWrapper<TStorageSchema extends StorageScheme> {
    readonly driver: PrefixedStorage<StorageKey>;

    get<TKey extends Extract<keyof TStorageSchema, string>>(
        key: TKey
    ): Promise<Result<Nullable<TStorageSchema[TKey]>, unknown>>;

    set<TKey extends Extract<keyof TStorageSchema, string>>(
        key: TKey,
        val: TStorageSchema[TKey]
    ): Promise<Result<void, unknown>>;

    remove<TKey extends Extract<keyof TStorageSchema, string>>(key: TKey): Promise<void>;
    clear(): Promise<void>;
}
