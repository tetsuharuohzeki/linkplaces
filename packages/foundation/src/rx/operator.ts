import type { Observable } from './observable.js';
import type { Unsubscribable } from './subscribable.js';
import type { Subscriber } from './subscriber.js';

export interface Operator<TInput, TOutput> {
    call(subscriber: Subscriber<TInput, TOutput>, source: Observable<TInput>): Unsubscribable;
}

export type UnaryFunction<TInput, TOutput> = (source: TInput) => TOutput;

export type OperatorFunction<TInput, TOutput> = UnaryFunction<Observable<TInput>, Observable<TOutput>>;
