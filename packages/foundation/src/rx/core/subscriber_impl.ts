import { isNotNull, unwrapNullable, type Nullable } from 'option-t/esm/Nullable';
import type { Unsubscribable } from './subscribable.js';
import type { CompletionResult, Observer, Subscriber, TeardownFn } from './subscriber.js';

/**
 *  @internal
 *  This is required to implement the libary.
 *  Do not expose to user.
 */
export abstract class InternalSubscriber<T> implements Subscriber<T>, Unsubscribable {
    private _isClosed: boolean;
    private _calledOnCompleted: boolean;
    private _finalizers: Nullable<Set<TeardownFn>>;
    constructor() {
        this._isClosed = false;
        this._calledOnCompleted = false;
        this._finalizers = null;
    }

    protected abstract onNext(value: T): void;
    protected abstract onErrorResume(error: unknown): void;
    protected abstract onCompleted(result: CompletionResult): void;
    // As a part of override point but not required.
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    protected onUnsubscribe(): void {}

    get closed(): boolean {
        return this._isClosed;
    }

    isClosed(): boolean {
        return this._isClosed;
    }

    private isCalledCompleted(): boolean {
        return this._calledOnCompleted;
    }

    next(value: T): void {
        if (this._isClosed || this.isCalledCompleted()) {
            return;
        }

        try {
            this.onNext(value);
        } catch (err: unknown) {
            this.errorResume(err);
        }
    }

    errorResume(error: unknown): void {
        if (this._isClosed || this.isCalledCompleted()) {
            return;
        }

        try {
            this.onErrorResume(error);
        } catch (e: unknown) {
            globalThis.reportError(e);
        }
    }

    complete(result: CompletionResult): void {
        if (this.isCalledCompleted()) {
            return;
        }
        this._calledOnCompleted = true;

        if (this._isClosed) {
            return;
        }

        try {
            this.onCompleted(result);
        } catch (e: unknown) {
            globalThis.reportError(e);
        } finally {
            this.unsubscribe();
        }
    }

    unsubscribe(): void {
        if (this._isClosed) {
            return;
        }

        this._isClosed = true;
        this.onUnsubscribe();

        const finalizerSet = this._finalizers;
        if (isNotNull(finalizerSet)) {
            this._finalizers = null;
            for (const finalizer of finalizerSet) {
                try {
                    finalizer();
                } catch (err: unknown) {
                    globalThis.reportError(err);
                }
            }
            finalizerSet.clear();
        }
    }

    addTeardown(teardown: TeardownFn): void {
        if (this._isClosed) {
            try {
                teardown();
            } catch (e: unknown) {
                globalThis.reportError(e);
            }
        }

        this._finalizers ??= new Set();
        const finalizers = unwrapNullable(this._finalizers);
        finalizers.add(teardown);
    }
}

export class PassThroughSubscriber<T> extends InternalSubscriber<T> {
    private _observer: Observer<T>;
    constructor(destination: Observer<T>) {
        super();
        this._observer = destination;
    }

    protected override onNext(value: T): void {
        this._observer.next(value);
    }

    protected override onErrorResume(error: unknown): void {
        this._observer.errorResume(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}
