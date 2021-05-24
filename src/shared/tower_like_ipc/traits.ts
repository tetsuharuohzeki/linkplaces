import type { Result } from 'option-t/esm/PlainResult';

export interface TowerService<TRequest, TResponse> {
    ready(): Promise<Result<void, Error>>;
    call(req: TRequest): Promise<TResponse>;
}

export interface Layer<TInputService, TOutputService> {
    layer(input: TInputService): TOutputService;
}
