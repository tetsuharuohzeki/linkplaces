import type { CompletionResult } from '../core/completion_result.js';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';
import { SubscriptionCompleteByFailureError } from '../core/subscription_error.js';

export type SyncFactoryFn<T> = (observer: Subscriber<T>, signal: AbortSignal) => void;

class SyncFactoryObservable<T> extends Observable<T> {
    constructor(factory: SyncFactoryFn<T>) {
        super((destination) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();
            });

            let result: CompletionResult = null;
            try {
                factory(destination, signal);
                result = null;
            } catch (e: unknown) {
                destination.error(e);
                result = new SubscriptionCompleteByFailureError(e);
                destination.complete(result);
            }
        });
    }
}

export function createObservable<T>(factory: SyncFactoryFn<T>): Observable<T> {
    const o = new SyncFactoryObservable<T>(factory);
    return o;
}
