import type { Maybe } from 'option-t/lib/Maybe/Maybe';
import { Result, createOk, createErr } from 'option-t/lib/PlainResult//Result';

import type { DOMStorageLikeDriver } from './DOMStorageLikeDriver';
import { createDOMStorageWrapper } from './DOMStorageWrapper';

export enum InitializationErrorKind {
    NoInstance,
    FailToFirstWrite,
}

function isDOMStorageNonNullable(s: Maybe<Storage>): s is Storage {
    // For some environments, DOM storage is disabled.
    // See https://developer.android.com/reference/android/webkit/WebSettings#setDomStorageEnabled(boolean)
    if (!!s) {
        return true;
    }

    return false;
}

const TEST_VAL = '__this_is_test_value_you_can_remove__';

function isDOMStorageWritable(storage: Storage, keyPrefix: string): boolean {
    const TEST_KEY = `${keyPrefix}:__test__:__this_is_test_entry_you_can_remove__`;

    // AFAIK, legacy Safari raise an error if we write some value on DOM Storage
    // if the user agent is in private browsing mode.
    // So we need to check that here.
    // However,  recent versions (iOS11 relased in 2017? I'm not sure about that well) does not happens such things.
    try {
        storage.setItem(TEST_KEY, TEST_VAL);
        return true;
    } catch (_e: unknown) {
        return false;
    }
}

function createDOMStorage(storage: Maybe<Storage>, keyPrefix: string): Result<DOMStorageLikeDriver, InitializationErrorKind> {
    if (!isDOMStorageNonNullable(storage)) {
        return createErr(InitializationErrorKind.NoInstance);
    }

    const isWritable = isDOMStorageWritable(storage, keyPrefix);
    if (!isWritable) {
        return createErr(InitializationErrorKind.NoInstance);
    }

    const wrapper = createDOMStorageWrapper(storage);
    const result = createOk(wrapper);
    return result;
}

export async function createLocalStorage(keyPrefix: string): Promise<Result<DOMStorageLikeDriver, InitializationErrorKind>> {
    const storage = globalThis.localStorage;
    const r = createDOMStorage(storage, keyPrefix);
    return r;
}

export async function createSessionStorage(keyPrefix: string): Promise<Result<DOMStorageLikeDriver, InitializationErrorKind>> {
    const storage = globalThis.sessionStorage;
    const r = createDOMStorage(storage, keyPrefix);
    return r;
}
