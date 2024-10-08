import { AsyncIterableX } from './iterable_x.js';

export type AsyncFilterFn<in T> = (input: T) => boolean | Promise<boolean>;

class FilterAsyncIterable<const in out T> extends AsyncIterableX<T> {
    private _filter: AsyncFilterFn<T>;

    constructor(source: AsyncIterable<T>, filter: AsyncFilterFn<T>) {
        super(source);
        this._filter = filter;
    }

    [Symbol.asyncIterator](): AsyncIteratorObject<T> {
        const iter = generateFilterAsyncIterator(this._source, this._filter);
        return iter;
    }
}

async function* generateFilterAsyncIterator<const T>(
    iter: AsyncIterable<T>,
    filter: AsyncFilterFn<T>
): AsyncGenerator<T> {
    for await (const item of iter) {
        const ok: boolean = await filter(item);
        if (!ok) {
            continue;
        }
        yield item;
    }
}

export function filterAsyncForAsyncIterable<const T>(
    source: AsyncIterable<T>,
    filter: AsyncFilterFn<T>
): AsyncIterable<T> {
    const wrapper = new FilterAsyncIterable(source, filter);
    return wrapper;
}
