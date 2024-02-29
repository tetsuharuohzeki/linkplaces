import type { Maybe } from 'option-t/esm/Maybe';
import type { CompletionResult } from './completion_result';

export interface Observer<T> {
    next(value: T): void;
    errorResume(error: unknown): void;
    complete(result: CompletionResult): void;
}

export type OnNextFn<T> = (v: T) => void;
export type OnErrorResumeFn = (error: unknown) => void;
export type OnCompleteFn = (result: CompletionResult) => void;

export interface SubscriptionObserver<T> {
    next?: Maybe<OnNextFn<T>>;
    errorResume?: Maybe<OnErrorResumeFn>;
    complete?: Maybe<OnCompleteFn>;
}


