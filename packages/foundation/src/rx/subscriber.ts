import type { Result } from 'option-t/esm/PlainResult';
import type { Observer } from './observer.js';
import { Subscription } from './subscription.js';

export abstract class Subscriber<TInput, TOutput> extends Subscription implements Observer<TInput> {
    private isStopped: boolean;
    protected destination: Observer<TOutput>;

    constructor(destination: Observer<TOutput>) {
        super(null);
        this.isStopped = false;
        this.destination = destination;
    }

    next(value: TInput): void {
        if (!this.isStopped) {
            this._next(value);
        }
    }

    errorResume(err: unknown): void {
        if (!this.isStopped) {
            this._errorResume(err);
        }
    }

    complete(result: Result<void, unknown>): void {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete(result);
        }
    }

    override unsubscribe(): void {
        if (!this.closed) {
            this.isStopped = true;
            super.unsubscribe();
        }
    }

    protected abstract _next(value: TInput): void;

    protected _errorResume(err: unknown): void {
        this.destination.errorResume(err);
    }

    protected _complete(result: Result<void, unknown>): void {
        try {
            this.destination.complete(result);
        } finally {
            this.unsubscribe();
        }
    }
}

export class PassSubscriber<T> extends Subscriber<T, T> {
    protected override _next(value: T): void {
        this.destination.next(value);
    }
}
