// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

export interface TowerService<TArgs extends ReadonlyArray<unknown>, out TOutput> {
    call(...args: TArgs): Promise<TOutput>;
}
