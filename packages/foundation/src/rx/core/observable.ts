import type { UnaryFunction } from './operator.js';
import type { Unsubscribable } from './subscribable.js';
import { type Subscriber, PartialObserver, type SubscriptionObserver, type Observer } from './subscriber.js';
import { PassThroughSubscriber, InternalSubscriber } from './subscriber_impl.js';

export type OnSubscribeFn<T> = (destination: Subscriber<T>) => Unsubscribable;

export interface ObservableLike<T> {
    subscribe(destination: Observer<T>): Unsubscribable;
}

export abstract class Observable<T> implements ObservableLike<T> {
    protected _onSubscribe: OnSubscribeFn<T>;
    constructor(onSubscribe: OnSubscribeFn<T>) {
        this._onSubscribe = onSubscribe;
    }

    subscribe(destination: Observer<T>): Unsubscribable {
        const subscriber =
            destination instanceof InternalSubscriber ? destination : new PassThroughSubscriber(destination);
        try {
            const subscription = this._onSubscribe(subscriber);
            subscriber.setSourceSubscription(subscription);
            return subscriber;
        } catch (err: unknown) {
            subscriber.unsubscribe();
            throw err;
        }
    }

    subscribeBy(destination: SubscriptionObserver<T>): Unsubscribable {
        const { next, errorResume, complete } = destination;
        const observer = new PartialObserver<T>(next, errorResume, complete);
        const subscriber = new PassThroughSubscriber(observer);
        const s = this.subscribe(subscriber);
        return s;
    }

    pipe<TOut>(op: UnaryFunction<Observable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
