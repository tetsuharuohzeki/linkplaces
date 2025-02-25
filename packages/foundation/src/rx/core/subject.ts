import { unwrapNullable, type Nullable } from 'option-t/nullable';

import { createCompletionOk, type CompletionResult } from './completion_result.js';
import { Observable } from './observable.js';
import type { Subjectable } from './subjectable.js';
import type { Subscriber } from './subscriber.js';

class SubjectObservable<T> extends Observable<T> {}

export class Subject<T> implements Subjectable<T> {
    private _isCompleted: boolean;
    private _completedValue: Nullable<CompletionResult>;
    private _observerCounter: number;
    private _observers: Map<number, Subscriber<T>>;
    private _observable: Observable<T>;

    constructor() {
        this._isCompleted = false;
        this._observerCounter = 0;
        this._observers = new Map();
        this._completedValue = null;
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
                const ok = createCompletionOk();
                observer.complete(ok);
            }
        }

        this._isCompleted = true;
        this._clearObservers();
    }

    private _onSubscribe(subscriber: Subscriber<T>): void {
        if (subscriber.destination() === this) {
            throw new Error('recursive subscription happens');
        }

        this._onSubjectSubscribe(subscriber);
    }

    protected _onSubjectSubscribe(destination: Subscriber<T>): void {
        if (this._isCompleted) {
            this._onSubscribeButCompleted(destination);
            return;
        }

        this._registerObserverOnSubscribe(destination);
    }

    protected _registerObserverOnSubscribe(destination: Subscriber<T>): void {
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

    protected _onSubscribeButCompleted(destination: Subscriber<T>): void {
        const result = unwrapNullable(this._completedValue);
        destination.complete(result);
    }

    asObservable(): Observable<T> {
        const cached = this._observable;
        return cached;
    }
}
