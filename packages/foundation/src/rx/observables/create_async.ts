import { createErr, createOk } from 'option-t/esm/PlainResult';
import { Observable } from '../core/observable.js';
import type { Observer } from '../core/observer.js';
import { Subscription } from '../core/subscription.js';

export type AsyncFactoryFn<T> = (observer: Observer<T>, signal: AbortSignal) => Promise<void>;

class AsyncFactoryObservable<T> extends Observable<T> {
    constructor(factory: AsyncFactoryFn<T>) {
        super((observer) => {
            const aborter = new AbortController();
            const signal = aborter.signal;

            const promise = factory(observer, signal);
            promise.then(
                () => {
                    const ok = createOk<void>(undefined);
                    observer.complete(ok);
                },
                (e: unknown) => {
                    observer.errorResume(e);
                    const error = createErr(e);
                    observer.complete(error);
                }
            );

            const sub = new Subscription(() => {
                aborter.abort();
            });
            return sub;
        });
    }
}

export function createObservableFromAsync<T>(factory: AsyncFactoryFn<T>): Observable<T> {
    const o = new AsyncFactoryObservable<T>(factory);
    return o;
}
