export type AsyncMapFn<TInput, TOutput> = (input: TInput) => (TOutput | Promise<TOutput>);

export async function* mapAsyncForAsyncIterable<TInput, TOutput>(iter: Iterable<TInput>, transform: AsyncMapFn<TInput, TOutput>): AsyncIterator<TOutput> {
    for await (const item of iter) {
        const result: TOutput = await transform(item);
        yield result;
    }
}
