import { isNull } from 'option-t/nullable';

import type { CompletionResult } from './completion_result.js';
import { Observable } from './observable.js';
import type { Subjectable } from './subjectable.js';
import type { Subscriber } from './subscriber.js';
import { SubscriptionError } from './subscription_error.js';

class SubjectObservable<T> extends Observable<T> {}

export class Subject<T> implements Subjectable<T> {
    private _hasActive: boolean;
    private _observerCounter: number;
    private _observers: Map<number, Subscriber<T>>;
    private _observable: Observable<T>;

    constructor() {
        this._hasActive = false;
        this._observerCounter = 0;
        this._observers = new Map();
        this._observable = new SubjectObservable<T>((subscriber) => {
            this._onSubscribe(subscriber);
        });
    }

    get hasActive(): boolean {
        const hasActive = this._hasActive;
        return hasActive;
    }

    private _getObserverSnapshots(): ReadonlyArray<Subscriber<T>> {
        const current = this._observers.values();
        const snapshot = Array.from(current);
        return snapshot;
    }

    private _clearObservers(): void {
        this._observers.clear();
        this._observerCounter = 0;
        this._hasActive = false;
    }

    next(value: T): void {
        if (!this._hasActive) {
            return;
        }

        const snapshots = this._getObserverSnapshots();
        for (const observer of snapshots) {
            observer.next(value);
        }
    }

    error(err: unknown): void {
        if (!this._hasActive) {
            return;
        }

        const snapshots = this._getObserverSnapshots();
        for (const observer of snapshots) {
            observer.error(err);
        }
    }

    complete(result: CompletionResult): void {
        if (
            !(
                isNull(null) ||
                // FIXME: This should be `Error.isError`
                result instanceof Error
            )
        ) {
            throw new TypeError('the passed result must be CompletionResult');
        }

        if (this._hasActive) {
            const snapshots = this._getObserverSnapshots();
            for (const observer of snapshots) {
                observer.complete(result);
            }
        }

        this._clearObservers();
    }

    unsubscribe(): void {
        if (this._hasActive) {
            const snapshots = this._getObserverSnapshots();
            for (const observer of snapshots) {
                observer.complete(null);
            }
        }

        this._clearObservers();
    }

    private _onSubscribe(subscriber: Subscriber<T>): void {
        // FIXME:
        // This is a simple check to recursive subscription by self
        // by the assumption which a event broadcaster is only this (or derived) class in this observable framework.
        // This cannot prevents the case a multiple chaining of observables.
        // We should remove this check as non practical assertion or
        // should introduce a more comprehensive mechanism to check a such kind of recursive chain.
        if (subscriber.destination() === this) {
            throw new SubscriptionError('recursive subscription happens');
        }

        this._onSubjectSubscribe(subscriber);
    }

    private _onSubjectSubscribe(destination: Subscriber<T>): void {
        this._onInitialValueEmittablePointInSubjectSubscribe(destination);

        this._registerObserverOnSubscribe(destination);
    }

    // XXX: This allows to extend the emittion point for  derived class.
    // eslint-disable-next-line class-methods-use-this
    protected _onInitialValueEmittablePointInSubjectSubscribe(_destination: Subscriber<T>): void {}

    private _registerObserverOnSubscribe(destination: Subscriber<T>): void {
        const currentObservers = this._observers;
        const observerId = this._getObserverId();
        currentObservers.set(observerId, destination);
        this._hasActive = true;

        destination.addTeardown(() => {
            currentObservers.delete(observerId);
            if (currentObservers.size === 0) {
                this._hasActive = false;
            }
        });
    }

    private _getObserverId() {
        const observerId = this._observerCounter;
        const nextId = observerId + 1;
        if (nextId >= Number.MAX_SAFE_INTEGER) {
            throw new RangeError(`Too many observer is registred.`);
        }
        this._observerCounter = nextId;

        return observerId;
    }

    asObservable(): Observable<T> {
        const cached = this._observable;
        return cached;
    }
}
