import { createErr, createOk, type Result } from 'option-t/esm/PlainResult';
import { Observable } from '../observable.js';
import type { Observer } from '../observer.js';
import { Subscription } from '../subscription.js';

export type SyncFactoryFn<T> = (observer: Observer<T>, signal: AbortSignal) => void;

class SyncFactoryObservable<T> extends Observable<T> {
    constructor(factory: SyncFactoryFn<T>) {
        super((observer) => {
            const aborter = new AbortController();
            const signal = aborter.signal;

            let result: Result<void, unknown>;
            try {
                factory(observer, signal);
                result = createOk(undefined);
            } catch (e: unknown) {
                observer.errorResume(e);
                result = createErr(e);
            }
            observer.complete(result);

            const sub = new Subscription(() => {
                aborter.abort();
            });
            return sub;
        });
    }
}

export function createObservable<T>(factory: SyncFactoryFn<T>): Observable<T> {
    const o = new SyncFactoryObservable<T>(factory);
    return o;
}
