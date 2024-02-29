import { Observable } from './observable.js';
import type { Unsubscribable } from './subscribable.js';
import type { Subscriber } from './subscriber.js';
import type { InternalSubscriber } from './subscriber_impl.js';

export interface Operator<TInput, TOutput> {
    call(subscriber: InternalSubscriber<TOutput>, source: Observable<TInput>): Unsubscribable;
}

export type UnaryFunction<TInput, TOutput> = (source: TInput) => TOutput;

export type OperatorFunction<TInput, TOutput> = UnaryFunction<Observable<TInput>, Observable<TOutput>>;

export abstract class OperatorObservable<TInput, TOutput> extends Observable<TOutput> {
    protected source: Observable<TInput>;
    constructor(source: Observable<TInput>) {
        super((destination: Subscriber<TOutput>) => {
            this.onSubscribe(destination);
        });
        this.source = source;
    }

    protected abstract onSubscribe(destination: Subscriber<TOutput>): void;
}

export abstract class DeclarativeObservable<T> extends Observable<T> {
    constructor() {
        super((destination: Subscriber<T>) => {
            this.onSubscribe(destination);
        });
    }

    protected abstract onSubscribe(destination: Subscriber<T>): void;
}
