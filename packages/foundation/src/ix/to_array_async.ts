export async function toArrayAsyncFromAsyncIterable<T>(iter: AsyncIterable<T>): Promise<Array<T>> {
    const result: Array<T> = [];
    for await (const item of iter) {
        result.push(item);
    }
    return result;
}
