import { type Observer, PartialObserver } from './observer.js';
import type { UnaryFunction } from './operator.js';
import type { Unsubscribable } from './subscribable.js';
import { PassThroughSubscriber, Subscriber } from './subscriber.js';

type OnSubscribeFn<T> = (destination: Observer<T>) => Unsubscribable;

export abstract class Observable<T> {
    protected _onSubscribe: OnSubscribeFn<T>;
    constructor(onSubscribe: OnSubscribeFn<T>) {
        this._onSubscribe = onSubscribe;
    }

    subscribe(destination: Observer<T>): Unsubscribable {
        const subscriber = destination instanceof Subscriber ? destination : new PassThroughSubscriber(destination);
        try {
            const subscription = this._onSubscribe(subscriber);
            subscriber.setSourceSubscription(subscription);
            return subscriber;
        } catch (err: unknown) {
            subscriber.unsubscribe();
            throw err;
        }
    }

    subscribeBy(destination: Partial<Observer<T>>): Unsubscribable {
        const { next, errorResume, complete } = destination;
        const o = new PartialObserver<T>(next, errorResume, complete);
        const s = this.subscribe(o);
        return s;
    }

    pipe<TOut>(op: UnaryFunction<Observable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
