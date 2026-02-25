import type { Result } from 'option-t/plain_result';

export interface MessageSendable<in TPayload extends object> {
    destroy(): void;
    postMessage(payload: TPayload): Promise<Result<unknown, Error>>;
    postOneShotMessage(payload: TPayload): void;
}

export type MessageRespondableServiceFn<in out TRequest, in out TResponse> = (req: TRequest) => Promise<TResponse>;
