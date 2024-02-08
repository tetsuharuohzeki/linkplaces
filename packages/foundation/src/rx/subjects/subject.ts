import { unwrapNullable, type Nullable } from 'option-t/esm/Nullable';
import { createOk, type Result } from 'option-t/esm/PlainResult';

import { Observable } from '../observable.js';
import type { Observer } from '../observer.js';
import type { Unsubscribable } from '../subscribable.js';
import { Subscription } from '../subscription.js';
import type { Subjectable } from './subjectable.js';

export class Subject<T> extends Observable<T> implements Subjectable<T> {
    private _isCompleted: boolean;
    private _completedValue: Nullable<Result<void, unknown>>;
    private _observerCounter: number;
    private _observers: Map<number, Observer<T>>;

    constructor() {
        super((subscriber: Observer<T>) => {
            const sub = this.onSubscribe(subscriber);
            return sub;
        });
        this._isCompleted = false;
        this._observerCounter = 0;
        this._observers = new Map();
        this._completedValue = null;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
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
        if (this._isCompleted) {
            return;
        }

        const snapshots = this.getObserverSnapshots();
        for (const observer of snapshots) {
            observer.next(value);
        }
    }

    errorResume(err: unknown): void {
        if (this._isCompleted) {
            return;
        }

        const snapshots = this.getObserverSnapshots();
        for (const observer of snapshots) {
            observer.errorResume(err);
        }
    }

    complete(result: Result<void, unknown>): void {
        if (this._isCompleted) {
            return;
        }

        this._isCompleted = true;
        this._completedValue = result;

        const snapshots = this.getObserverSnapshots();
        for (const observer of snapshots) {
            observer.complete(result);
        }

        this._clearObservers();
    }

    unsubscribe() {
        if (!this._isCompleted) {
            const snapshots = this.getObserverSnapshots();
            for (const observer of snapshots) {
                const ok = createOk(undefined);
                observer.complete(ok);
            }
        }

        this._isCompleted = true;
        this._clearObservers();
    }

    protected onSubscribe(observer: Observer<T>): Unsubscribable {
        if (this._isCompleted) {
            this.onSubscribeButCompleted(observer);
            return new Subscription(null);
        }

        const sub = this.registerObserverOnSubscribe(observer);
        return sub;
    }

    protected registerObserverOnSubscribe(observer: Observer<T>) {
        const currentObservers = this._observers;
        const observerId = this.getObserverId();
        currentObservers.set(observerId, observer);

        const teardown = new Subscription(() => {
            currentObservers.delete(observerId);
        });
        return teardown;
    }

    private getObserverId() {
        const observerId = this._observerCounter;
        this._observerCounter = observerId + 1;
        return observerId;
    }

    protected onSubscribeButCompleted(observer: Observer<T>): void {
        const result = unwrapNullable(this._completedValue);
        observer.complete(result);
    }

    asObservable(): Observable<T> {
        return this;
    }
}
