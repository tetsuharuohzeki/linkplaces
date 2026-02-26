export type IteratorObjectFactoryFn<T> = () => IteratorObject<T>;

export class LazyIterable<const in out T> {
    private _factory: IteratorObjectFactoryFn<T>;
    constructor(factory: IteratorObjectFactoryFn<T>) {
        this._factory = factory;
    }

    [Symbol.iterator](): IteratorObject<T> {
        return lazify(this._factory);
    }
}

function* lazify<T>(factory: IteratorObjectFactoryFn<T>): Generator<T> {
    const iterator: IteratorObject<T> = factory();
    yield* iterator;
}

export function lazyForIterable<const T>(factory: () => IteratorObject<T>): LazyIterable<T> {
    const iterable = new LazyIterable(factory);
    return iterable;
}
