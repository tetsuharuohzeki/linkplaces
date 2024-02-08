import { isNotNull, type Nullable } from 'option-t/esm/Nullable';
import type { CompletionResult, Observer } from './observer.js';
import type { Unsubscribable } from './subscribable.js';

/**
 *  @internal
 *  This is required to implement the libary.
 *  Do not expose to user.
 */
export abstract class Subscriber<T> implements Observer<T>, Unsubscribable {
    private _isClosed: boolean;
    private _calledOnCompleted: boolean;
    constructor() {
        this._isClosed = false;
        this._calledOnCompleted = false;
    }

    protected abstract onNext(value: T): void;
    protected abstract onErrorResume(error: unknown): void;
    protected abstract onCompleted(result: CompletionResult): void;
    // As a part of override point but not required.
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    protected onUnsubscribe(): void {}

    private _sourceSubscription: Nullable<Unsubscribable> = null;
    setSourceSubscription(sub: Unsubscribable): void {
        this._sourceSubscription = sub;
    }

    isClosed(): boolean {
        return this._isClosed;
    }

    private isCalledCompleted(): boolean {
        return this._calledOnCompleted;
    }

    next(value: T): void {
        if (this.isClosed() || this.isCalledCompleted()) {
            return;
        }

        try {
            this.onNext(value);
        } catch (err: unknown) {
            this.errorResume(err);
        }
    }

    errorResume(error: unknown): void {
        if (this.isClosed() || this.isCalledCompleted()) {
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

        if (this.isClosed()) {
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
        if (this.isClosed()) {
            return;
        }

        this._isClosed = true;
        this.onUnsubscribe();

        const sourceSubscription = this._sourceSubscription;
        if (isNotNull(sourceSubscription)) {
            sourceSubscription.unsubscribe();
        }
        this._sourceSubscription = null;
    }
}

export class PassThroughSubscriber<T> extends Subscriber<T> {
    private _observer: Observer<T>;
    constructor(observer: Observer<T>) {
        super();
        this._observer = observer;
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
