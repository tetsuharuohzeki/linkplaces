import { unwrapUndefinable } from 'option-t/esm/Undefinable';
import { closeIterator, getIterator } from './iterable_x.js';

type IterableInputTuple<T> = {
    [K in keyof T]: Iterable<T[K]>;
};

type VariadicSource<TTuple extends ReadonlyArray<unknown>> = readonly [...IterableInputTuple<TTuple>];

class ZipIterable<TTuple extends ReadonlyArray<unknown>> implements Iterable<TTuple> {
    private _sources: VariadicSource<TTuple>;

    constructor(sources: VariadicSource<TTuple>) {
        this._sources = sources;
    }

    [Symbol.iterator](): Iterator<TTuple> {
        const sources = this._sources;
        const iter = iterateAsZip(sources);
        return iter;
    }
}

function* iterateAsZip<TTuple extends ReadonlyArray<unknown>>(sources: VariadicSource<TTuple>): Iterator<TTuple> {
    const sourcesLength = sources.length;
    const iterators = sources.map(getIterator);
    // eslint-disable-next-line no-unmodified-loop-condition
    while (sourcesLength > 0) {
        const values = new Array(sourcesLength);
        for (let index = -1; ++index < sourcesLength; ) {
            const iter = unwrapUndefinable(iterators[index]);
            const result = iter.next();
            if (result.done) {
                for (const iter of iterators) {
                    closeIterator(iter);
                }
                return;
            }
            values[index] = result.value;
        }
        // I don't have a nice way to make this type to return type properly with variadic.
        // @ts-expect-error
        yield values;
    }
}

export function zipForIterable<TTuple extends ReadonlyArray<unknown>>(
    ...sources: VariadicSource<TTuple>
): Iterable<TTuple> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (sources.length < 2) {
        throw new RangeError("sources contains only single elements. It's meaningless");
    }

    const iter = new ZipIterable(sources);
    return iter;
}
