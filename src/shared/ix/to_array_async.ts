type AsyncConsumable<T> = Iterable<T> | Generator<T>;

export async function toArrayAsyncFromAsyncIterable<T>(iter: AsyncConsumable<T>): Promise<Array<T>> {
    const result: Array<T> = [];
    for await (const item of iter) {
        result.push(item);
    }
    return result;
}
