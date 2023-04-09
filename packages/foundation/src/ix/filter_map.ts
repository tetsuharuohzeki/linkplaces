import { isNull } from 'option-t/Nullable/Nullable';
import { IterableX } from './iterable_x.js';

export type NoneValComparatorFn<TValue, TNone> = (input: TValue | TNone) => input is TNone;
export type FilterMapFn<in TInput, out TOutput, out TNone> = (input: TInput) => TOutput | TNone;

class FilterMapIterable<const in out TInput, const in out TOutput, const in out TNone> extends IterableX<
    TInput,
    TOutput
> {
    #filterMap: FilterMapFn<TInput, TOutput, TNone>;
    #nullComparator: NoneValComparatorFn<TOutput, TNone>;

    constructor(
        source: Iterable<TInput>,
        filterMap: FilterMapFn<TInput, TOutput, TNone>,
        noneValComparator: NoneValComparatorFn<TOutput, TNone>
    ) {
        super(source);
        this.#filterMap = filterMap;
        this.#nullComparator = noneValComparator;
    }

    [Symbol.iterator](): Iterator<TOutput> {
        const iter = generateForIterator(this._source, this.#filterMap, this.#nullComparator);
        return iter;
    }
}

function* generateForIterator<const TInput, const TOutput, const TNone>(
    iter: Iterable<TInput>,
    transformer: FilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): Iterator<TOutput> {
    for (const item of iter) {
        const result: TOutput | TNone = transformer(item);
        if (noneValComparator(result)) {
            continue;
        }
        yield result;
    }
}

export function filterMapForIterable<const TInput, const TOutput>(
    source: Iterable<TInput>,
    transformer: FilterMapFn<TInput, TOutput, null>
): Iterable<TOutput> {
    const wrapper = new FilterMapIterable(source, transformer, isNull);
    return wrapper;
}

export function filterMapWithComparatorForIterable<const TInput, const TOutput, const TNone>(
    source: Iterable<TInput>,
    transformer: FilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): Iterable<TOutput> {
    const wrapper = new FilterMapIterable(source, transformer, noneValComparator);
    return wrapper;
}
