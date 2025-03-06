import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';
import { SubscriptionCompleteByFailureError } from '../core/subscription_error.js';

export type AsyncFactoryFn<T> = (observer: Subscriber<T>, signal: AbortSignal) => Promise<void>;

class AsyncFactoryObservable<T> extends Observable<T> {
    constructor(factory: AsyncFactoryFn<T>) {
        super((destination) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();
            });

            const promise = factory(destination, signal);
            promise.then(
                () => {
                    destination.complete(null);
                },
                (e: unknown) => {
                    destination.error(e);
                    const error = new SubscriptionCompleteByFailureError(e);
                    destination.complete(error);
                }
            );
        });
    }
}

export function createObservableFromAsync<T>(factory: AsyncFactoryFn<T>): Observable<T> {
    const o = new AsyncFactoryObservable<T>(factory);
    return o;
}
