import { isErr, isOk, type Result } from 'option-t/esm/PlainResult';
import { Observable } from '../core/observable.js';
import type { Observer, Subscriber } from '../core/subscriber.js';
import { Subscription } from '../core/subscription.js';

class MergeObserver<T> implements Observer<T> {
    private _refCount: number;
    private _destination: Subscriber<T>;

    constructor(refCount: number, destination: Subscriber<T>) {
        this._refCount = refCount;
        this._destination = destination;
    }

    private _decrementRef(): number {
        this._refCount = this._refCount - 1;
        return this._refCount;
    }

    next(value: T): void {
        this._destination.next(value);
    }

    errorResume(error: unknown): void {
        this._destination.errorResume(error);
    }

    complete(result: Result<void, unknown>): void {
        if (isErr(result)) {
            this._destination.complete(result);
        } else if (isOk(result)) {
            const currentLivings = this._decrementRef();
            if (currentLivings <= 0) {
                this._destination.complete(result);
            }
        }
    }
}

class MergeAllObservable<T> extends Observable<T> {
    constructor(inputs: ReadonlyArray<Observable<T>>) {
        super((destination) => {
            const refCount = inputs.length;

            const rootSubscription = new Subscription(null);

            for (const source of inputs) {
                const childObserver = new MergeObserver(refCount, destination);
                const childSubscription = source.subscribe(childObserver);
                rootSubscription.add(childSubscription);
            }

            return rootSubscription;
        });
    }
}

export function mergeAll<T>(...arrays: Array<Observable<T>>): Observable<T> {
    const o = new MergeAllObservable(arrays);
    return o;
}
