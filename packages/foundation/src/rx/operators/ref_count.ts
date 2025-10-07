import { unwrapNullable, type Nullable } from 'option-t/nullable';
import type { ConnectableObservable } from '../core/connectable_observable.js';
import type { Observable } from '../core/observable.js';
import { DeclarativeObservable, type UnaryFunction } from '../core/operator.js';
import type { Unsubscribable } from '../core/subscribable.js';
import type { Subscriber } from '../core/subscriber.js';

class RefCountObservable<T> extends DeclarativeObservable<T> {
    private _source: ConnectableObservable<T>;
    private _refCount: number = 0;
    private _sharedSubscription: Nullable<Unsubscribable> = null;

    constructor(source: ConnectableObservable<T>) {
        super();
        this._source = source;
    }

    protected onSubscribe(destination: Subscriber<T>): void {
        this._refCount += 1;

        const sub = this._source.subscribe(destination);
        const shouldConnect = this._refCount === 1;

        if (shouldConnect && destination.isActive()) {
            this._sharedSubscription = this._source.connect();
        }

        destination.addTeardown(() => {
            this._refCount -= 1;
            sub.unsubscribe();

            const shouldDisconnect = this._refCount === 0;
            if (shouldDisconnect) {
                const sharedSubscription = unwrapNullable(this._sharedSubscription);
                sharedSubscription.unsubscribe();
                this._sharedSubscription = null;
            }
        });
    }
}

export type RefCountOperatorFunction<T> = UnaryFunction<ConnectableObservable<T>, Observable<T>>;

export function refCount<T>(): RefCountOperatorFunction<T> {
    const operator: RefCountOperatorFunction<T> = (source: ConnectableObservable<T>) => {
        const connected = new RefCountObservable<T>(source);
        return connected;
    };
    return operator;
}
