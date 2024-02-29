import { createErr, createOk } from 'option-t/esm/PlainResult';
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
                    const ok = createOk<void>(undefined);
                    destination.complete(ok);
                },
                (e: unknown) => {
                    destination.errorResume(e);
                    const error = createErr(e);
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
