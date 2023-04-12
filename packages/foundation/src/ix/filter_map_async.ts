import { isNull } from 'option-t/Nullable/Nullable';

import type { NoneValComparatorFn } from './filter_map.js';
import { AsyncIterableX } from './iterable_x.js';

export type AsyncFilterMapFn<in TInput, out TOutput, out TNone> = (input: TInput) => Promise<TOutput | TNone>;

class AsyncFilterMapIterable<const in out TInput, const in out TOutput, const in out TNone> extends AsyncIterableX<
    TInput,
    TOutput
> {
    private _filterMap: AsyncFilterMapFn<TInput, TOutput, TNone>;
    private _nullComparator: NoneValComparatorFn<TOutput, TNone>;

    constructor(
        source: AsyncIterable<TInput>,
        filterMap: AsyncFilterMapFn<TInput, TOutput, TNone>,
        noneValComparator: NoneValComparatorFn<TOutput, TNone>
    ) {
        super(source);
        this._filterMap = filterMap;
        this._nullComparator = noneValComparator;
    }

    [Symbol.asyncIterator](): AsyncIterator<TOutput> {
        const iter = generateForIterator(this._source, this._filterMap, this._nullComparator);
        return iter;
    }
}

async function* generateForIterator<const TInput, const TOutput, const TNone>(
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

export function filterMapAsyncForAsyncIterable<const TInput, const TOutput>(
    source: AsyncIterable<TInput>,
    transformer: AsyncFilterMapFn<TInput, TOutput, null>
): AsyncIterable<TOutput> {
    const wrapper = new AsyncFilterMapIterable(source, transformer, isNull);
    return wrapper;
}

export function filterMapAsyncWithComparatorForAsyncIterable<const TInput, const TOutput, const TNone>(
    source: AsyncIterable<TInput>,
    transformer: AsyncFilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): AsyncIterable<TOutput> {
    const wrapper = new AsyncFilterMapIterable(source, transformer, noneValComparator);
    return wrapper;
}
