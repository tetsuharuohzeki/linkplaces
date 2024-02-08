import { unwrapNullable, type Nullable } from 'option-t/esm/Nullable';
import type { Result } from 'option-t/esm/PlainResult';

import { Observable } from '../observable.js';
import type { Observer } from '../observer.js';
import type { Subscribable } from '../subscribable.js';
import { PassSubscriber, Subscriber } from '../subscriber.js';
import { Subscription } from '../subscription.js';

export class Subject<T> extends Observable<T> implements Subscribable<T>, Observer<T> {
    private _closed: boolean;
    private _observerCounter: number;
    private _observers: Map<number, Observer<T>>;
    private _completeState: Nullable<Result<void, unknown>>;

    constructor() {
        super((subscriber: Observer<T>) => {
            this._checkFinalizedStatuses(subscriber);
            const sub = this._innerSubscribe(subscriber);
            return sub;
        });
        this._closed = false;
        this._observerCounter = 0;
        this._observers = new Map();
        this._completeState = null;
    }

    get closed(): boolean {
        return this._closed;
    }

    private getObserverSnapshots(): ReadonlyArray<Observer<T>> {
        const current = this._observers.values();
        const snapshot = Array.from(current);
        return snapshot;
    }

    protected _clearObservers(): void {
        this._observers.clear();
    }

    next(value: T): void {
        if (!this._closed) {
            const snapshots = this.getObserverSnapshots();
            for (const observer of snapshots) {
                observer.next(value);
            }
        }
    }

    errorResume(err: unknown): void {
        if (!this._closed) {
            const snapshots = this.getObserverSnapshots();
            for (const observer of snapshots) {
                observer.errorResume(err);
            }
        }
    }

    complete(result: Result<void, unknown>): void {
        if (!this._closed) {
            this._closed = true;
            this._completeState = result;
            const snapshots = this.getObserverSnapshots();
            for (const observer of snapshots) {
                observer.complete(result);
            }
            this._clearObservers();
        }
    }

    unsubscribe() {
        this._closed = true;
        this._clearObservers();
    }

    protected _innerSubscribe(observer: Observer<T>): Subscription {
        if (this._closed) {
            return new Subscription(null);
        }

        const subscriber = observer instanceof Subscriber ? observer : new PassSubscriber(observer);
        const currentObservers = this._observers;
        const observerId = this._observerCounter;
        this._observerCounter = observerId + 1;
        currentObservers.set(observerId, subscriber);

        const teardown = new Subscription(() => {
            currentObservers.delete(observerId);
        });
        subscriber.add(teardown);
        return subscriber;
    }

    protected _checkFinalizedStatuses(subscriber: Observer<T>) {
        if (this._closed) {
            const result = unwrapNullable(this._completeState);
            subscriber.complete(result);
        }
    }

    asObservable(): Observable<T> {
        const o = new Observable<T>((subscriber) => this.subscribe(subscriber));
        return o;
    }
}
