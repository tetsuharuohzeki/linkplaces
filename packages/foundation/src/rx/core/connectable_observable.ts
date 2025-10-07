import { Observable } from './observable.js';
import type { Unsubscribable } from './subscribable.js';

export abstract class ConnectableObservable<T> extends Observable<T> {
    abstract connect(): Unsubscribable;
}
