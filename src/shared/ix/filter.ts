export type FilterFn<T> = (input: T) => boolean;

export function* filterForIterable<T>(iter: Iterable<T>, filter: FilterFn<T>): Iterable<T> {
    for (const item of iter) {
        const ok = filter(item);
        if (!ok) {
            continue;
        }
        yield item;
    }
}
