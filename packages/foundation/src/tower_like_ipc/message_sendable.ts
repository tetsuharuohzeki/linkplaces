import type { Result } from 'option-t/plain_result';

export interface RpcMessageSendable<in TPayload extends object> {
    destroy(): void;
    postMessage(payload: TPayload): Promise<Result<unknown, Error>>;
    postOneShotMessage(payload: TPayload): void;
}

export type RpcMessageRespondableServiceFn<in out TRequest, in out TResponse> = (req: TRequest) => Promise<TResponse>;
