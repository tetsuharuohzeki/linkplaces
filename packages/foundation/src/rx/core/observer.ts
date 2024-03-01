import type { Maybe } from 'option-t/esm/Maybe';
import type { CompletionResult } from './completion_result';

export interface Observer<T> {
    next(value: T): void;
    error(error: unknown): void;
    complete(result: CompletionResult): void;
}

export type OnNextFn<T> = (v: T) => void;
export type OnErrorFn = (error: unknown) => void;
export type OnCompleteFn = (result: CompletionResult) => void;

export interface SubscriptionObserver<T> {
    next?: Maybe<OnNextFn<T>>;
    error?: Maybe<OnErrorFn>;
    complete?: Maybe<OnCompleteFn>;
}


