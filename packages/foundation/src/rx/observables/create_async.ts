import { createCompletionErr, createCompletionOk } from '../core/completion_result.js';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';

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
                    const ok = createCompletionOk();
                    destination.complete(ok);
                },
                (e: unknown) => {
                    destination.error(e);
                    const error = createCompletionErr(e);
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
