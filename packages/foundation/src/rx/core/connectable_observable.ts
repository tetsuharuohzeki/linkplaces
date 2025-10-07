import { Observable } from './observable.js';
import type { UnaryFunction } from './operator.js';
import type { Unsubscribable } from './subscribable.js';

export abstract class ConnectableObservable<T> extends Observable<T> {
    abstract connect(): Unsubscribable;

    override pipe<TOut>(op: UnaryFunction<ConnectableObservable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
