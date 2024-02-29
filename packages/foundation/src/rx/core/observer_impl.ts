import { unwrapOrFromMaybe, type Maybe } from 'option-t/cjs/Maybe';
import type { CompletionResult } from './completion_result';
import type { Observer, OnNextFn, OnErrorResumeFn, OnCompleteFn } from './observer';

function genericOnNext<T>(_: T): void {}
function genericOnErrorResume(_: unknown): void {}
function genericOnComplete(_: CompletionResult): void {}

export class PartialObserver<T> implements Observer<T> {
    next: OnNextFn<T>;
    errorResume: OnErrorResumeFn;
    complete: OnCompleteFn;

    constructor(next: Maybe<OnNextFn<T>>, errorResume: Maybe<OnErrorResumeFn>, complete: Maybe<OnCompleteFn>) {
        this.next = unwrapOrFromMaybe(next, genericOnNext);
        this.errorResume = unwrapOrFromMaybe(errorResume, genericOnErrorResume);
        this.complete = unwrapOrFromMaybe(complete, genericOnComplete);
    }
}
