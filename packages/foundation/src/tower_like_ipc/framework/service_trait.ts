// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

export type AnyTuple = ReadonlyArray<unknown>;

export interface TowerService<in TArgs extends AnyTuple, out TOutput> {
    // If we use `.call()` as for this naming,
    // TypeScript compiler accepts a normal function as an object
    // having `.call` as `Function.prototype.call`. It's error prone.
    process(...args: TArgs): Promise<TOutput>;
}
