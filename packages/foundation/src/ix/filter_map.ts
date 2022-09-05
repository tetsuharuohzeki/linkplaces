import { isNull } from 'option-t/Nullable/Nullable';
import { IterableX } from './iterable_x.js';

export type NoneValComparatorFn<TValue, TNone> = (input: TValue | TNone) => input is TNone;
export type FilterMapFn<in TInput, out TOutput, out TNone> = (input: TInput) => TOutput | TNone;

class FilterMapIterable<in out TInput, in out TOutput, in out TNone> extends IterableX<TInput, TOutput> {
    private _filterMap: FilterMapFn<TInput, TOutput, TNone>;
    private _nullComparator: NoneValComparatorFn<TOutput, TNone>;

    constructor(
        source: Iterable<TInput>,
        filterMap: FilterMapFn<TInput, TOutput, TNone>,
        noneValComparator: NoneValComparatorFn<TOutput, TNone>
    ) {
        super(source);
        this._filterMap = filterMap;
        this._nullComparator = noneValComparator;
    }

    [Symbol.iterator](): Iterator<TOutput> {
        const iter = generateForIterator(this._source, this._filterMap, this._nullComparator);
        return iter;
    }
}

function* generateForIterator<TInput, TOutput, TNone>(
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

export function filterMapForIterable<TInput, TOutput>(
    source: Iterable<TInput>,
    transformer: FilterMapFn<TInput, TOutput, null>
): Iterable<TOutput> {
    const wrapper = new FilterMapIterable(source, transformer, isNull);
    return wrapper;
}

export function filterMapWithComparatorForIterable<TInput, TOutput, TNone>(
    source: Iterable<TInput>,
    transformer: FilterMapFn<TInput, TOutput, TNone>,
    noneValComparator: NoneValComparatorFn<TOutput, TNone>
): Iterable<TOutput> {
    const wrapper = new FilterMapIterable(source, transformer, noneValComparator);
    return wrapper;
}
