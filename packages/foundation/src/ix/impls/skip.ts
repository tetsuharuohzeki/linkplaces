import { IterableX } from './iterable_x.js';

class SkipIterable<const in out T> extends IterableX<T, T> {
    private _count: number;

    constructor(source: Iterable<T>, count: number) {
        super(source);
        this._count = count;
    }

    [Symbol.iterator](): Iterator<T> {
        const iter = generateSkipIterator(this._source, this._count);
        return iter;
    }
}

function* generateSkipIterator<const T>(iter: Iterable<T>, count: number): Iterator<T> {
    let i = 0;
    for (const item of iter) {
        i += 1;

        if (i > count) {
            yield item;
        }
    }
}

export function skipForIterable<const T>(source: Iterable<T>, count: number): Iterable<T> {
    if (count <= 0) {
        throw new RangeError(`cound must be >= 1. but the actual is ${String(count)}`);
    }

    const wrapper = new SkipIterable(source, count);
    return wrapper;
}
