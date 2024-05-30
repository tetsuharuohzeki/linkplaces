import { Ix } from '@linkplaces/foundation';
import type { Nullable } from 'option-t/nullable';
import { type Result, createOk, createErr, unwrapOrForResult } from 'option-t/plain_result';
import { unwrapUndefinable } from 'option-t/undefinable';

const MIME_TEXT_PLAIN = 'text/plain';
const MIME_TEXT_URI_LIST = 'text/uri-list';
// This is set for Firefox's tab D&D.
const MIME_TEXT_X_MOZ_TEXT_INTERNAL = 'text/x-moz-text-internal';

class SiderbarDropItemProcessingError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, {
            cause,
        });
        this.name = this.constructor.name;
    }
}

const SUPPORTED_MIME_SET: ReadonlySet<string> = new Set([
    MIME_TEXT_PLAIN,
    MIME_TEXT_URI_LIST,
    MIME_TEXT_X_MOZ_TEXT_INTERNAL,
]);

export function hasSupportedMimeType(dataTransfer: DataTransfer): boolean {
    for (const type of dataTransfer.types) {
        const has = SUPPORTED_MIME_SET.has(type);
        if (has) {
            return true;
        }
    }
    return false;
}

export function isSupportedFirefoxTabDrag(dataTransfer: DataTransfer): boolean {
    const dataTransferTypes = dataTransfer.types;
    if (dataTransferTypes.length === 0 || !dataTransferTypes.includes(MIME_TEXT_X_MOZ_TEXT_INTERNAL)) {
        return false;
    }
    return true;
}

export async function tryGetUrlFromFirefoxTab(dataTransfer: DataTransfer): Promise<Nullable<Array<string>>> {
    const list = [];
    for (let i = 0, dataTransferItems = dataTransfer.items, l = dataTransferItems.length; i < l; ++i) {
        const item = unwrapUndefinable(dataTransferItems[i]);
        if (item.type !== MIME_TEXT_X_MOZ_TEXT_INTERNAL) {
            continue;
        }

        const value = new Promise<string>((resolve) => item.getAsString(resolve));
        list.push(value);
    }

    const result = await Promise.all(list);
    const filtered = result.filter((item) => {
        return URL.canParse(item);
    });
    return filtered;
}

export function tryToGetTextUriList(
    dataTransfer: DataTransfer
): Result<Array<string>, SiderbarDropItemProcessingError> {
    const text = dataTransfer.getData(MIME_TEXT_URI_LIST);
    if (text === '') {
        const e = new SiderbarDropItemProcessingError(`could not get ${MIME_TEXT_URI_LIST} data`);
        return createErr(e);
    }

    const candidateList = text.split('\n');
    const list = Ix.map(candidateList, validateUrlLikeString);
    const success = Ix.filterMap(list, (item) => {
        const result: Nullable<string> = unwrapOrForResult(item, null);
        return result;
    });
    const successList = Ix.toArray(success);
    if (successList.length === 0) {
        const e = new SiderbarDropItemProcessingError(`could not get any valid items in ${MIME_TEXT_URI_LIST} data`);
        return createErr(e);
    }

    return createOk(successList);
}

export function tryToGetTextPlain(dataTransfer: DataTransfer): Result<string, SiderbarDropItemProcessingError> {
    const text = dataTransfer.getData(MIME_TEXT_PLAIN);
    if (text === '') {
        const e = new SiderbarDropItemProcessingError(`could not get ${MIME_TEXT_PLAIN} data`);
        return createErr(e);
    }

    const result = validateUrlLikeString(text);
    return result;
}

function validateUrlLikeString(text: string): Result<string, SiderbarDropItemProcessingError> {
    if (!URL.canParse(text)) {
        const e = new SiderbarDropItemProcessingError(`the data is not url: ${text}`);
        return createErr(e);
    }

    return createOk(text);
}
