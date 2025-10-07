import type { CompletionResult } from '../core/completion_result.js';
import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import { InternalSubscriber } from '../core/subscriber_impl.js';

export type EffectFn<TInput> = (value: TInput) => void;

class InspectSubscriber<T> extends InternalSubscriber<T> {
    private _observer: Subscriber<T>;
    private _effector: EffectFn<T>;

    constructor(destination: Subscriber<T>, effector: EffectFn<T>) {
        super();
        this._observer = destination;
        this._effector = effector;
    }

    protected override onNext(value: T): void {
        this._effector(value);
        this._observer.next(value);
    }

    protected override onError(error: unknown): void {
        this._observer.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class InspectObservable<T> extends OperatorObservable<T, T> {
    private _effector: EffectFn<T>;

    constructor(source: Observable<T>, effector: EffectFn<T>) {
        super(source);
        this._effector = effector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const innerSub = new InspectSubscriber(destination, this._effector);
        this.source.subscribe(innerSub);
    }
}

export function inspect<T>(effector: EffectFn<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const mapped: Observable<T> = new InspectObservable<T>(source, effector);
        return mapped;
    };
    return operator;
}
