import { isNotNull, type Nullable } from 'option-t/esm/Nullable';
import { createErr } from 'option-t/esm/PlainResult';
import { OnNextObserver, type Observer } from './observer.js';
import type { UnaryFunction } from './operator.js';
import type { Subscribable, Unsubscribable } from './subscribable.js';
import { PassSubscriber, Subscriber } from './subscriber.js';

type OnSubscribeFn<T> = (subscriber: Observer<T>) => Unsubscribable;

export class Observable<T> implements Subscribable<T> {
    private _onSubscribe: OnSubscribeFn<T>;

    constructor(onSubscribe: OnSubscribeFn<T>) {
        this._onSubscribe = onSubscribe;
    }

    protected _getOnSubscribe(): OnSubscribeFn<T> {
        return this._onSubscribe;
    }

    protected _setOnSubscribe(subscriber: OnSubscribeFn<T>): void {
        this._onSubscribe = subscriber;
    }

    subscribe(observer: Observer<T>): Unsubscribable {
        const subscriber = observer instanceof Subscriber ? observer : new PassSubscriber(observer);
        const s = this._trySubscribe(subscriber);
        if (isNotNull(s)) {
            subscriber.add(s);
        }
        return subscriber;
    }

    subscribeNext(onNext: (value: T) => void): Unsubscribable {
        const observer = new OnNextObserver(onNext);
        const s = this.subscribe(observer);
        return s;
    }

    private _trySubscribe(sink: Subscriber<unknown, T>): Nullable<Unsubscribable> {
        const fn = this._onSubscribe;
        try {
            const s = fn(sink);
            return s;
        } catch (err) {
            const e = createErr(err);
            sink.complete(e);
            return null;
        }
    }

    pipe<TOut>(op: UnaryFunction<Observable<T>, TOut>): TOut {
        const r = op(this);
        return r;
    }
}
