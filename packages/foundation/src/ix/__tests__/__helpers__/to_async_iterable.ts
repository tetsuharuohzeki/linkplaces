export function toAsyncIterable<T>(source: Iterable<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            return iterate(source);
        },
    };
}

async function* iterate<T>(source: Iterable<T>) {
    for await (const val of source) {
        yield val;
    }
}
