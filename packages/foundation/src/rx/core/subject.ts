import { unwrapNullable, type Nullable } from 'option-t/esm/Nullable';
import { createOk, type Result } from 'option-t/esm/PlainResult';

import { Observable } from './observable.js';
import type { Subjectable } from './subjectable.js';
import type { Unsubscribable } from './subscribable.js';
import type { Observer, Subscriber } from './subscriber.js';
import { Subscription } from './subscription.js';

export class Subject<T> extends Observable<T> implements Subjectable<T> {
    private _isCompleted: boolean;
    private _completedValue: Nullable<Result<void, unknown>>;
    private _observerCounter: number;
    private _observers: Map<number, Subscriber<T>>;

    constructor() {
        super((destination: Subscriber<T>) => {
            const sub = this.onSubscribe(destination);
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

    private getObserverSnapshots(): ReadonlyArray<Subscriber<T>> {
        const current = this._observers.values();
        const snapshot = Array.from(current);
        return snapshot;
    }

    protected _clearObservers(): void {
        this._observers.clear();
    }

    override subscribe(destination: Observer<T>): Unsubscribable {
        if (destination === this) {
            throw new Error('recursive subscription happens');
        }

        const sub = super.subscribe(destination);
        return sub;
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

    protected onSubscribe(destination: Subscriber<T>): Unsubscribable {
        if (this._isCompleted) {
            this.onSubscribeButCompleted(destination);
            return new Subscription(null);
        }

        const sub = this.registerObserverOnSubscribe(destination);
        return sub;
    }

    protected registerObserverOnSubscribe(destination: Subscriber<T>) {
        const currentObservers = this._observers;
        const observerId = this.getObserverId();
        currentObservers.set(observerId, destination);

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

    protected onSubscribeButCompleted(destination: Subscriber<T>): void {
        const result = unwrapNullable(this._completedValue);
        destination.complete(result);
    }

    asObservable(): Observable<T> {
        return this;
    }
}
