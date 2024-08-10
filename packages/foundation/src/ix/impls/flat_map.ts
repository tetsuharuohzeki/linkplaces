import { IterableX } from './iterable_x.js';

export type FlatMapTransformFn<TInput, out TOutput> = (input: TInput) => Iterable<TOutput>;

class FlatMapIterable<const TInput, const out TOutput> extends IterableX<TInput, TOutput> {
    private _transformer: FlatMapTransformFn<TInput, TOutput>;

    constructor(source: Iterable<TInput>, transformer: FlatMapTransformFn<TInput, TOutput>) {
        super(source);
        this._transformer = transformer;
    }

    [Symbol.iterator](): BuiltinIterator<TOutput> {
        const iter = generateFlatMapIterator(this._source, this._transformer);
        return iter;
    }
}

function* generateFlatMapIterator<const TInput, const TOutput>(
    iter: Iterable<TInput>,
    transformer: FlatMapTransformFn<TInput, TOutput>
): BuiltinIterator<TOutput> {
    for (const item of iter) {
        const result = transformer(item);
        yield* result;
    }
}

export function flatMapForIterable<const TInput, const TOutput>(
    source: Iterable<TInput>,
    transformer: FlatMapTransformFn<TInput, TOutput>
): Iterable<TOutput> {
    const wrapper = new FlatMapIterable(source, transformer);
    return wrapper;
}
