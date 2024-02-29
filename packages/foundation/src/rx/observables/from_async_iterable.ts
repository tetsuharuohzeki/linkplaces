import { createCompletionOk } from '../core/completion_result.js';
import type { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';
import { createObservableFromAsync } from './create_async.js';

async function iterate<T>(factory: AsyncIterable<T>, destination: Subscriber<T>, signal: AbortSignal): Promise<void> {
    for await (const item of factory) {
        if (signal.aborted) {
            break;
        }

        destination.next(item);
    }

    const ok = createCompletionOk();
    destination.complete(ok);
}

export function fromAsyncIterableToObservable<T>(factory: AsyncIterable<T>): Observable<T> {
    const o = createObservableFromAsync<T>(async (destination, signal) => {
        const promise = iterate<T>(factory, destination, signal);
        return promise;
    });
    return o;
}
