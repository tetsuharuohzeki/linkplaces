import { isNull } from 'option-t/nullable';

import { unwrapUndefinable, type Undefinable } from 'option-t/undefinable';
import type { CompletionResult } from './completion_result.js';
import { Observable } from './observable.js';
import type { Subjectable } from './subjectable.js';
import type { Subscriber } from './subscriber.js';
import { SubscriptionError } from './subscription_error.js';

class SubjectObservable<T> extends Observable<T> {}

export class Subject<T> implements Subjectable<T> {
    private _isCompleted: boolean;
    private _completedValue: Undefinable<CompletionResult>;
    private _observerCounter: number;
    private _observers: Map<number, Subscriber<T>>;
    private _observable: Observable<T>;

    constructor() {
        this._isCompleted = false;
        this._observerCounter = 0;
        this._observers = new Map();
        this._completedValue = undefined;
        this._observable = new SubjectObservable<T>((subscriber) => {
            this._onSubscribe(subscriber);
        });
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    private _getObserverSnapshots(): ReadonlyArray<Subscriber<T>> {
        const current = this._observers.values();
        const snapshot = Array.from(current);
        return snapshot;
    }

    private _clearObservers(): void {
        this._observers.clear();
    }

    next(value: T): void {
        if (this._isCompleted) {
            return;
        }

        const snapshots = this._getObserverSnapshots();
        for (const observer of snapshots) {
            observer.next(value);
        }
    }

    error(err: unknown): void {
        if (this._isCompleted) {
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

        if (this._isCompleted) {
            return;
        }

        this._isCompleted = true;
        this._completedValue = result;

        const snapshots = this._getObserverSnapshots();
        for (const observer of snapshots) {
            observer.complete(result);
        }

        this._clearObservers();
    }

    unsubscribe(): void {
        if (!this._isCompleted) {
            const snapshots = this._getObserverSnapshots();
            for (const observer of snapshots) {
                observer.complete(null);
            }
        }

        this._isCompleted = true;
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
        if (this._isCompleted) {
            this._onSubscribeButCompleted(destination);
            return;
        }

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

        destination.addTeardown(() => {
            currentObservers.delete(observerId);
        });
    }

    private _getObserverId() {
        const observerId = this._observerCounter;
        this._observerCounter = observerId + 1;
        return observerId;
    }

    private _onSubscribeButCompleted(destination: Subscriber<T>): void {
        const result = unwrapUndefinable(this._completedValue);
        destination.complete(result);
    }

    asObservable(): Observable<T> {
        const cached = this._observable;
        return cached;
    }
}
