export function toArrayFromIterable<const T>(iter: Iterable<T>): Array<T> {
    const result: Array<T> = [];
    for (const item of iter) {
        result.push(item);
    }
    return result;
}


