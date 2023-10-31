import { Ix } from '@linkplaces/foundation';
import type { Nullable } from 'option-t/Nullable';
import { type Result, createOk, createErr, unwrapOrFromResult } from 'option-t/PlainResult';

const MIME_TEXT_PLAIN = 'text/plain';
const MIME_TEXT_URI_LIST = 'text/uri-list';

class SiderbarDropItemProcessingError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, {
            cause,
        });
        this.name = this.constructor.name;
    }
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
        const result: Nullable<string> = unwrapOrFromResult(item, null);
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
