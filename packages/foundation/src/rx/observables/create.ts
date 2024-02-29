import { createErr, createOk, type Result } from 'option-t/esm/PlainResult';
import { Observable } from '../core/observable.js';
import type { Subscriber } from '../core/subscriber.js';

export type SyncFactoryFn<T> = (observer: Subscriber<T>, signal: AbortSignal) => void;

class SyncFactoryObservable<T> extends Observable<T> {
    constructor(factory: SyncFactoryFn<T>) {
        super((destination) => {
            const aborter = new AbortController();
            const signal = aborter.signal;
            destination.addTeardown(() => {
                aborter.abort();
            });

            let result: Result<void, unknown>;
            try {
                factory(destination, signal);
                result = createOk(undefined);
            } catch (e: unknown) {
                destination.errorResume(e);
                result = createErr(e);
            }
            destination.complete(result);
        });
    }
}

export function createObservable<T>(factory: SyncFactoryFn<T>): Observable<T> {
    const o = new SyncFactoryObservable<T>(factory);
    return o;
}
