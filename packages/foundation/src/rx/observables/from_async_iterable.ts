import type { Observable } from '../core/observable.js';
import type { Observer } from '../core/observer.js';
import { createObservableFromAsync } from './create_async.js';

async function iterate<T>(factory: AsyncIterable<T>, observer: Observer<T>, signal: AbortSignal): Promise<void> {
    for await (const item of factory) {
        if (signal.aborted) {
            break;
        }

        observer.next(item);
    }
}

export function fromAsyncIterableToObservable<T>(factory: AsyncIterable<T>): Observable<T> {
    const o = createObservableFromAsync<T>(async (observer, signal) => {
        const promise = iterate<T>(factory, observer, signal);
        return promise;
    });
    return o;
}
