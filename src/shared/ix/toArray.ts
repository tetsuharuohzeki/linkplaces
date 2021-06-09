type Consumable<T> = Iterable<T> | Generator<T>;

export function toArrayFromIterable<T>(iter: Consumable<T>): Array<T> {
    const result: Array<T> = [];
    for (const item of iter) {
        result.push(item);
    }
    return result;
}

type AsyncConsumable<T> = Iterable<T> | Generator<T>;

export async function toArrayAsyncFromAsyncIterable<T>(iter: AsyncConsumable<T>): Promise<Array<T>> {
    const result: Array<T> = [];
    for await (const item of iter) {
        result.push(item);
    }
    return result;
}
