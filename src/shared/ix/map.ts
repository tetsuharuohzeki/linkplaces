export type MapFn<TInput, TOutput> = (input: TInput) => TOutput;
export type AsyncMapFn<TInput, TOutput> = (input: TInput) => (TOutput | Promise<TOutput>);

export function* mapForIterable<TInput, TOutput>(iter: Iterable<TInput>, transform: MapFn<TInput, TOutput>): Iterable<TOutput> {
    for (const item of iter) {
        const result = transform(item);
        yield result;
    }
}

export async function* mapAsyncForAsyncIterable<TInput, TOutput>(iter: Iterable<TInput>, transform: AsyncMapFn<TInput, TOutput>): AsyncIterable<TOutput> {
    for await (const item of iter) {
        const result: TOutput = await transform(item);
        yield result;
    }
}
