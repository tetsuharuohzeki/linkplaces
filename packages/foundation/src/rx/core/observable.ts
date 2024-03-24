import type { Observer, PartialObserver } from './observer.js';
import { PartialObserverWrapper } from './observer_impl.js';
import type { UnaryFunction } from './operator.js';
import type { Unsubscribable } from './subscribable.js';
import type { Subscriber } from './subscriber.js';
import { PassThroughSubscriber, InternalSubscriber } from './subscriber_impl.js';
import { SubscriptionError } from './subscription_error.js';

export type OnSubscribeFn<T> = (destination: Subscriber<T>) => void;

export interface ObservableLike<T> {
    subscribe(destination: Observer<T>): Unsubscribable;
}

export abstract class Observable<T> implements ObservableLike<T> {
    protected _onSubscribe: OnSubscribeFn<T>;
    constructor(onSubscribe: OnSubscribeFn<T>) {
        this._onSubscribe = onSubscribe;
    }

    subscribe(destination: Observer<T>): Unsubscribable {
        const subscriber: InternalSubscriber<unknown> =
            destination instanceof InternalSubscriber ? destination : new PassThroughSubscriber(destination);
        if (subscriber.closed) {
            throw new SubscriptionError('subscriber has been closed');
        }

        try {
            this._onSubscribe(subscriber);
        } catch (err: unknown) {
            subscriber.unsubscribe();
            throw err;
        }

        return subscriber;
    }

    subscribeBy(destination: PartialObserver<T>): Unsubscribable {
        const { onNext, onError, onCompleted } = destination;
        const observer = new PartialObserverWrapper<T>(onNext, onError, onCompleted);
        const subscriber = new PassThroughSubscriber(observer);
        const s = this.subscribe(subscriber);
        return s;
    }

    pipe<TOut>(op: UnaryFunction<Observable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
