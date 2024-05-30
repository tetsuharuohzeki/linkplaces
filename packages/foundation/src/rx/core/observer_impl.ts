import { unwrapOrForMaybe, type Maybe } from 'option-t/maybe';
import type { CompletionResult } from './completion_result';
import type { Observer, OnNextFn, OnErrorFn, OnCompleteFn as OnCompletedFn } from './observer';

function genericOnNext<T>(_: T): void {}
function genericOnError(_: unknown): void {}
function genericOnCompleted(_: CompletionResult): void {}

export class PartialObserverWrapper<T> implements Observer<T> {
    next: OnNextFn<T>;
    error: OnErrorFn;
    complete: OnCompletedFn;

    constructor(onNext: Maybe<OnNextFn<T>>, onError: Maybe<OnErrorFn>, onCompleted: Maybe<OnCompletedFn>) {
        this.next = unwrapOrForMaybe(onNext, genericOnNext);
        this.error = unwrapOrForMaybe(onError, genericOnError);
        this.complete = unwrapOrForMaybe(onCompleted, genericOnCompleted);
    }
}
