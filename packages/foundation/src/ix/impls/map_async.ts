import { AsyncIterableX } from './iterable_x.js';

export type AsyncTransformFn<TInput, out TOutput> = (input: TInput) => TOutput | Promise<TOutput>;

class MapAsyncIterable<const TInput, const out TOutput> extends AsyncIterableX<TInput, TOutput> {
    private _transformer: AsyncTransformFn<TInput, TOutput>;

    constructor(source: AsyncIterable<TInput>, transformer: AsyncTransformFn<TInput, TOutput>) {
        super(source);
        this._transformer = transformer;
    }

    [Symbol.asyncIterator](): BuiltinAsyncIterator<TOutput> {
        const iter = generateMapAsyncIterator(this._source, this._transformer);
        return iter;
    }
}

async function* generateMapAsyncIterator<const TInput, const TOutput>(
    iter: AsyncIterable<TInput>,
    transform: AsyncTransformFn<TInput, TOutput>
): BuiltinAsyncIterator<TOutput> {
    for await (const item of iter) {
        const result: TOutput = await transform(item);
        yield result;
    }
}

export function mapAsyncForAsyncIterable<const TInput, const TOutput>(
    source: AsyncIterable<TInput>,
    transformer: AsyncTransformFn<TInput, TOutput>
): AsyncIterable<TOutput> {
    const wrapper = new MapAsyncIterable(source, transformer);
    return wrapper;
}
