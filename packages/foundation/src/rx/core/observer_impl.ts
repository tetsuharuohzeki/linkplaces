import { unwrapOrFromMaybe, type Maybe } from 'option-t/cjs/Maybe';
import type { CompletionResult } from './completion_result';
import type { Observer, OnNextFn, OnErrorFn, OnCompleteFn as OnCompletedFn } from './observer';

function genericOnNext<T>(_: T): void {}
function genericOnError(_: unknown): void {}
function genericOnCompleted(_: CompletionResult): void {}

export class PartialObserver<T> implements Observer<T> {
    next: OnNextFn<T>;
    error: OnErrorFn;
    complete: OnCompletedFn;

    constructor(next: Maybe<OnNextFn<T>>, error: Maybe<OnErrorFn>, complete: Maybe<OnCompletedFn>) {
        this.next = unwrapOrFromMaybe(next, genericOnNext);
        this.error = unwrapOrFromMaybe(error, genericOnError);
        this.complete = unwrapOrFromMaybe(complete, genericOnCompleted);
    }
}
