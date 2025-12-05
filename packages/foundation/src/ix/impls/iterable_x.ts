export abstract class IterableX<const in out TInput, const out TOutput = TInput> implements Iterable<TOutput> {
    protected _source: Iterable<TInput>;
    constructor(source: Iterable<TInput>) {
        this._source = source;
    }
    abstract [Symbol.iterator](): Iterator<TOutput>;
}

export abstract class AsyncIterableX<
    const in out TInput,
    const out TOutput = TInput,
> implements AsyncIterable<TOutput> {
    protected _source: AsyncIterable<TInput>;
    constructor(source: AsyncIterable<TInput>) {
        this._source = source;
    }
    abstract [Symbol.asyncIterator](): AsyncIterator<TOutput>;
}

export function getIterator<T>(iter: Iterable<T>): Iterator<T> {
    return iter[Symbol.iterator]();
}

export function closeIterator(iter: Iterator<unknown>): void {
    iter.return?.();
}
