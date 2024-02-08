import { Observable } from './observable.js';
import type { Observer } from './observer.js';
import type { Unsubscribable } from './subscribable.js';
import type { Subscriber } from './subscriber.js';

export interface Operator<TInput, TOutput> {
    call(subscriber: Subscriber<TOutput>, source: Observable<TInput>): Unsubscribable;
}

export type UnaryFunction<TInput, TOutput> = (source: TInput) => TOutput;

export type OperatorFunction<TInput, TOutput> = UnaryFunction<Observable<TInput>, Observable<TOutput>>;

export abstract class OperatorObservable<TInput, TOutput> extends Observable<TOutput> {
    protected source: Observable<TInput>;
    constructor(source: Observable<TInput>) {
        super((destination: Observer<TOutput>) => {
            const sub = this.onSubscribe(destination);
            return sub;
        });
        this.source = source;
    }

    protected abstract onSubscribe(destination: Observer<TOutput>): Unsubscribable;
}

export abstract class DeclarativeObservable<T> extends Observable<T> {
    constructor() {
        super((destination: Observer<T>) => {
            const sub = this.onSubscribe(destination);
            return sub;
        });
    }

    protected abstract onSubscribe(destination: Observer<T>): Unsubscribable;
}
