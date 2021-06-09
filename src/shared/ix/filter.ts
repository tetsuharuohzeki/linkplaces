export type FilterFn<T> = (input: T) => boolean;
export type AsyncFilterFn<T> = (input: T) => (boolean | Promise<boolean>);

export function* filterForIterable<T>(iter: Iterable<T>, filter: FilterFn<T>): Iterator<T> {
    for (const item of iter) {
        const ok = filter(item);
        if (!ok) {
            continue;
        }
        yield item;
    }
}

export async function* filterAsyncForAsyncIterable<T>(iter: AsyncIterable<T>, filter: AsyncFilterFn<T>): AsyncIterator<T> {
    for await (const item of iter) {
        const ok: boolean = await filter(item);
        if (!ok) {
            continue;
        }
        yield item;
    }
}
