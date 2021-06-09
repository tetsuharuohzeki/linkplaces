export type AsyncFilterFn<T> = (input: T) => (boolean | Promise<boolean>);

export async function* filterAsyncForAsyncIterable<T>(iter: AsyncIterable<T>, filter: AsyncFilterFn<T>): AsyncIterator<T> {
    for await (const item of iter) {
        const ok: boolean = await filter(item);
        if (!ok) {
            continue;
        }
        yield item;
    }
}
