export type MapFn<TInput, TOutput> = (input: TInput) => TOutput;

export function* mapForIterable<TInput, TOutput>(iter: Iterable<TInput>, transform: MapFn<TInput, TOutput>): Iterator<TOutput> {
    for (const item of iter) {
        const result = transform(item);
        yield result;
    }
}
