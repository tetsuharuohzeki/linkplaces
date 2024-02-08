import { OnNextObserver, type Observer } from './observer.js';
import type { UnaryFunction } from './operator.js';
import type { Unsubscribable } from './subscribable.js';
import { PassThroughSubscriber, Subscriber } from './subscriber.js';

type OnSubscribeFn<T> = (observer: Observer<T>) => Unsubscribable;

export abstract class Observable<T> {
    protected _onSubscribe: (observer: Observer<T>) => Unsubscribable;
    constructor(onSubscribe: OnSubscribeFn<T>) {
        this._onSubscribe = onSubscribe;
    }

    subscribe(observer: Observer<T>): Unsubscribable {
        const subscriber = observer instanceof Subscriber ? observer : new PassThroughSubscriber(observer);
        try {
            const subscription = this._onSubscribe(observer);
            subscriber.setSourceSubscription(subscription);
            return subscriber;
        } catch (err: unknown) {
            subscriber.unsubscribe();
            throw err;
        }
    }

    subscribeNext(onNext: (value: T) => void): Unsubscribable {
        const observer = new OnNextObserver(onNext);
        const s = this.subscribe(observer);
        return s;
    }

    pipe<TOut>(op: UnaryFunction<Observable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
