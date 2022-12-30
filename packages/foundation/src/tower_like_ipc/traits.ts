// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

import type { Result } from 'option-t/PlainResult';

export interface TowerService<TRequest, out TResponse> {
    ready(): Promise<Result<void, Error>>;
    call(req: TRequest): Promise<TResponse>;
}

export interface MultipleArgsTowerService<
    TArgs extends ReadonlyArray<unknown>,
    out TOutput
> {
    ready(): Promise<Result<void, Error>>;
    call(...args: TArgs): Promise<TOutput>;
}
