import { isNotNull, unwrapNullable, type Nullable } from 'option-t/esm/Nullable';
import type { CompletionResult } from './completion_result.js';
import type { Observer } from './observer.js';
import type { Unsubscribable } from './subscribable.js';
import type { Subscriber, TeardownFn } from './subscriber.js';

/**
 *  @internal
 *  This is required to implement the libary.
 *  Do not expose to user.
 */
export abstract class InternalSubscriber<T> implements Subscriber<T>, Unsubscribable {
    private _isActive: boolean;
    private _isCalledOnCompleted: boolean;
    private _finalizers: Nullable<Set<TeardownFn>>;
    constructor() {
        this._isActive = true;
        this._isCalledOnCompleted = false;
        this._finalizers = null;
    }

    protected abstract onNext(value: T): void;
    protected abstract onError(error: unknown): void;
    protected abstract onCompleted(result: CompletionResult): void;
    // As a part of override point but not required.
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    protected onUnsubscribe(): void {}

    get closed(): boolean {
        return !this._isActive;
    }

    isActive(): boolean {
        return this._isActive;
    }

    next(value: T): void {
        if (this.closed || this._isCalledOnCompleted) {
            return;
        }

        try {
            this.onNext(value);
        } catch (err: unknown) {
            this.error(err);
        }
    }

    error(error: unknown): void {
        if (this.closed || this._isCalledOnCompleted) {
            return;
        }

        try {
            this.onError(error);
        } catch (e: unknown) {
            globalThis.reportError(e);
        }
    }

    complete(result: CompletionResult): void {
        if (this._isCalledOnCompleted) {
            return;
        }
        this._isCalledOnCompleted = true;

        if (this.closed) {
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
        if (this.closed) {
            return;
        }

        this._isActive = false;
        this.onUnsubscribe();

        this._runFinalizer();
    }

    private _runFinalizer(): void {
        const finalizerSet = this._finalizers;
        if (isNotNull(finalizerSet)) {
            this._finalizers = null;
            for (const finalizer of finalizerSet) {
                tryToRunTeardown(finalizer);
            }
            finalizerSet.clear();
        }
    }

    addTeardown(teardown: TeardownFn): void {
        if (this.closed) {
            tryToRunTeardown(teardown);
            return;
        }

        this._finalizers ??= new Set();
        const finalizers = unwrapNullable(this._finalizers);
        finalizers.add(teardown);
    }
}

function tryToRunTeardown(finalizer: TeardownFn): void {
    try {
        finalizer();
    } catch (err: unknown) {
        globalThis.reportError(err);
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

    protected override onError(error: unknown): void {
        this._observer.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}
