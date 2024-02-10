import { unwrapOrFromMaybe, type Maybe } from 'option-t/cjs/Maybe';
import type { Result } from 'option-t/esm/PlainResult';

export type CompletionResult = Result<void, unknown>;

export interface Observer<T> {
    next(value: T): void;
    errorResume(error: unknown): void;
    complete(result: CompletionResult): void;
}

export interface Subscriber<T> extends Observer<T> {}

export type OnNextFn<T> = (v: T) => void;
export type OnErrorResumeFn = (error: unknown) => void;
export type OnCompleteFn = (result: CompletionResult) => void;

export interface SubscriptionObserver<T> {
    next?: Maybe<OnNextFn<T>>;
    errorResume?: Maybe<OnErrorResumeFn>;
    complete?: Maybe<OnCompleteFn>;
}

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
