// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

export type AnyTuple = ReadonlyArray<unknown>;

export interface TowerService<in TArgs extends AnyTuple, out TOutput> {
    call(...args: TArgs): Promise<TOutput>;
}
