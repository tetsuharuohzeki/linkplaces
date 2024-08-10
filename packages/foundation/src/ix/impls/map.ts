import { IterableX } from './iterable_x.js';

export type TransformFn<TInput, out TOutput> = (input: TInput) => TOutput;

class MapIterable<const TInput, const out TOutput> extends IterableX<TInput, TOutput> {
    private _transformer: TransformFn<TInput, TOutput>;

    constructor(source: Iterable<TInput>, transformer: TransformFn<TInput, TOutput>) {
        super(source);
        this._transformer = transformer;
    }

    [Symbol.iterator](): BuiltinIterator<TOutput> {
        const iter = generateMapIterator(this._source, this._transformer);
        return iter;
    }
}

function* generateMapIterator<const TInput, const TOutput>(
    iter: Iterable<TInput>,
    transformer: TransformFn<TInput, TOutput>
): BuiltinIterator<TOutput> {
    for (const item of iter) {
        const result = transformer(item);
        yield result;
    }
}

export function mapForIterable<const TInput, const TOutput>(
    source: Iterable<TInput>,
    transformer: TransformFn<TInput, TOutput>
): Iterable<TOutput> {
    const wrapper = new MapIterable(source, transformer);
    return wrapper;
}
