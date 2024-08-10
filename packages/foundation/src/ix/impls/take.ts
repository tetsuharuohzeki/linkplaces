import { IterableX } from './iterable_x.js';

class TakeIterable<const in out T> extends IterableX<T, T> {
    private _count: number;

    constructor(source: Iterable<T>, count: number) {
        super(source);
        this._count = count;
    }

    [Symbol.iterator](): BuiltinIterator<T> {
        const iter = generateTakeIterator(this._source, this._count);
        return iter;
    }
}

function* generateTakeIterator<const T>(iter: Iterable<T>, count: number): BuiltinIterator<T> {
    let i = count;
    for (const item of iter) {
        i -= 1;
        if (i < 0) {
            break;
        } else {
            yield item;
        }
    }
}

export function takeForIterable<const T>(source: Iterable<T>, count: number): Iterable<T> {
    if (count <= 0) {
        throw new RangeError(`cound must be >= 1. but the actual is ${String(count)}`);
    }

    const wrapper = new TakeIterable(source, count);
    return wrapper;
}
