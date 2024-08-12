export function toAsyncIterable<T>(source: Iterable<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIteratorObject<T> {
            return iterate(source);
        },
    };
}

async function* iterate<T>(source: Iterable<T>): AsyncGenerator<T> {
    for await (const val of source) {
        yield val;
    }
}
