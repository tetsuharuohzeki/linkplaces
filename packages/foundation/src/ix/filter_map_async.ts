import { isNull } from 'option-t/Nullable/Nullable';

import type { NoneValComparatorFn } from './filter_map.js';
import { AsyncIterableX } from './iterable_x.js';

export type AsyncFilterMapFn<in TInput, out TOutput, out TNone> = (input: TInput) => Promise<TOutput | TNone>;

class AsyncFilterMapIterable<in out TInput, in out TOutput, in out TNone> extends AsyncIterableX<TInput, TOutput> {
    #filterMap: AsyncFilterMapFn<TInput, TOutput, TNone>;
    #nullComparator: NoneValComparatorFn<TOutput, TNone>;

    constructor(
        source: AsyncIterable<TInput>,
        filterMap: AsyncFilterMapFn<TInput, TOutput, TNone>,
        noneValComparator: NoneValComparatorFn<TOutput, TNone>
    ) {
        super(source);
        this.#filterMap = filterMap;
        this.#nullComparator = noneValComparator;
    }

    [Symbol.asyncIterator](): AsyncIterator<TOutput> {
        const iter = generateForIterator(this._source, this.#filterMap, this.#nullComparator);
        return iter;
    }
}

async function* generateForIterator<TInput, TOutput, TNone>(
    iter: AsyncIterable<TInput>,
    transformer: AsyncFilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): AsyncIterator<TOutput> {
    for await (const item of iter) {
        const result: TOutput | TNone = await transformer(item);
        if (noneValComparator(result)) {
            continue;
        }
        yield result;
    }
}

export function filterMapAsyncForAsyncIterable<TInput, TOutput>(
    source: AsyncIterable<TInput>,
    transformer: AsyncFilterMapFn<TInput, TOutput, null>
): AsyncIterable<TOutput> {
    const wrapper = new AsyncFilterMapIterable(source, transformer, isNull);
    return wrapper;
}

export function filterMapAsyncWithComparatorForAsyncIterable<TInput, TOutput, TNone>(
    source: AsyncIterable<TInput>,
    transformer: AsyncFilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): AsyncIterable<TOutput> {
    const wrapper = new AsyncFilterMapIterable(source, transformer, noneValComparator);
    return wrapper;
}
