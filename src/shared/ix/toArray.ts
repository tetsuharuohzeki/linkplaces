export function toArrayFromIterable<T>(iter: Iterable<T>): Array<T> {
    const result: Array<T> = [];
    for (const item of iter) {
        result.push(item);
    }
    return result;
}
