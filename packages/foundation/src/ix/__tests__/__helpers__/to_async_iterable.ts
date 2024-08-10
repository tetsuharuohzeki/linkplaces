export function toAsyncIterable<T>(source: Iterable<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): BuiltinAsyncIterator<T> {
            return iterate(source);
        },
    };
}

async function* iterate<T>(source: Iterable<T>): BuiltinAsyncIterator<T> {
    for await (const val of source) {
        yield val;
    }
}
