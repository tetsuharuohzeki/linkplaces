import { AsyncIterableX } from './iterable_x';

export type AsyncTransformFn<TInput, TOutput> = (input: TInput) => TOutput | Promise<TOutput>;

class MapAsyncIterable<TInput, TOutput> extends AsyncIterableX<TInput, TOutput> {
    private _transformer: AsyncTransformFn<TInput, TOutput>;

    constructor(
        source: AsyncIterable<TInput>,
        transformer: AsyncTransformFn<TInput, TOutput>
    ) {
        super(source);
        this._transformer = transformer;
    }

    [Symbol.asyncIterator](): AsyncIterator<TOutput> {
        const iter = generateMapAsyncIterator(this._source, this._transformer);
        return iter;
    }
}

async function* generateMapAsyncIterator<TInput, TOutput>(
    iter: AsyncIterable<TInput>,
    transform: AsyncTransformFn<TInput, TOutput>
): AsyncIterator<TOutput> {
    for await (const item of iter) {
        const result: TOutput = await transform(item);
        yield result;
    }
}

export function mapAsyncForAsyncIterable<TInput, TOutput>(
    source: AsyncIterable<TInput>,
    transformer: AsyncTransformFn<TInput, TOutput>
): AsyncIterable<TOutput> {
    const wrapper = new MapAsyncIterable(source, transformer);
    return wrapper;
}
