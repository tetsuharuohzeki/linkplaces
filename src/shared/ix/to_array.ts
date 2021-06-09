type Consumable<T> = Iterable<T> | Generator<T>;

export function toArrayFromIterable<T>(iter: Consumable<T>): Array<T> {
    const result: Array<T> = [];
    for (const item of iter) {
        result.push(item);
    }
    return result;
}


