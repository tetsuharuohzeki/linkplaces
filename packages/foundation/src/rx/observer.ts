import type { Result } from 'option-t/esm/PlainResult';

export type CompletionResult = Result<void, unknown>;

export interface Observer<T> {
    next(value: T): void;
    errorResume(error: unknown): void;
    complete(result: CompletionResult): void;
}

export type OnNextFn<T> = (v: T) => void;

export class OnNextObserver<T> implements Observer<T> {
    next: OnNextFn<T>;
    constructor(onNext: OnNextFn<T>) {
        this.next = onNext;
    }

    errorResume(_: unknown): void {}

    complete(_: Result<void, unknown>): void {}
}
