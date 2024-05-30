import type { Maybe } from 'option-t/maybe';
import type { CompletionResult } from './completion_result';

export interface Observer<T> {
    next(value: T): void;
    error(error: unknown): void;
    complete(result: CompletionResult): void;
}

export type OnNextFn<T> = (v: T) => void;
export type OnErrorFn = (error: unknown) => void;
export type OnCompleteFn = (result: CompletionResult) => void;

export interface PartialObserver<T> {
    onNext?: Maybe<OnNextFn<T>>;
    onError?: Maybe<OnErrorFn>;
    onCompleted?: Maybe<OnCompleteFn>;
}
