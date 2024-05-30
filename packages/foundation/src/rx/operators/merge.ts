import { isErr, isOk } from 'option-t/plain_result';

import { assertUnreachable } from '../../assert_never.js';
import type { CompletionResult } from '../core/completion_result.js';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';
import { InternalSubscriber } from '../core/subscriber_impl.js';

class MergeSubscriber<T> extends InternalSubscriber<T> {
    private _refCount: number;
    private _destination: Subscriber<T>;

    constructor(refCount: number, destination: Subscriber<T>) {
        super();

        this._refCount = refCount;
        this._destination = destination;
    }

    private _decrementRef(): number {
        this._refCount = this._refCount - 1;
        return this._refCount;
    }

    protected override onNext(value: T): void {
        this._destination.next(value);
    }

    protected override onError(error: unknown): void {
        this._destination.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        if (isErr(result)) {
            this._destination.complete(result);
        } else if (isOk(result)) {
            const currentLivings = this._decrementRef();
            if (currentLivings <= 0) {
                this._destination.complete(result);
            }
        } else {
            assertUnreachable(result);
        }
    }
}

class MergeAllObservable<T> extends Observable<T> {
    constructor(inputs: ReadonlyArray<Observable<T>>) {
        super((destination) => {
            const refCount = inputs.length;

            for (const source of inputs) {
                const childObserver = new MergeSubscriber(refCount, destination);
                const childSubscription = source.subscribe(childObserver);
                destination.addTeardown(() => {
                    childSubscription.unsubscribe();
                });
            }
        });
    }
}

export function mergeAll<T>(...arrays: Array<Observable<T>>): Observable<T> {
    const o = new MergeAllObservable(arrays);
    return o;
}
