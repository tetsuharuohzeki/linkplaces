// Inspired by https://tokio.rs/blog/2021-05-14-inventing-the-service-trait

import type { Result } from 'option-t/esm/PlainResult';

export interface TowerService<TRequest, TResponse> {
    ready(): Promise<Result<void, Error>>;
    call(req: TRequest): Promise<TResponse>;
}

export interface MultipleArgsTowerService<
    TArgs extends ReadonlyArray<unknown>,
    TOutput
> {
    ready(): Promise<Result<void, Error>>;
    call(...args: TArgs): Promise<TOutput>;
}

export interface Layer<TInputService, TOutputService> {
    layer(input: TInputService): TOutputService;
}
