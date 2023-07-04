// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

import type { Result } from 'option-t/PlainResult';

export interface TowerService<TArgs extends ReadonlyArray<unknown>, out TOutput> {
    ready(): Promise<Result<void, Error>>;
    call(...args: TArgs): Promise<TOutput>;
}
