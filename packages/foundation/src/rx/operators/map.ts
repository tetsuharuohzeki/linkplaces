import type { CompletionResult } from '../core/completion_result.js';
import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Unsubscribable } from '../core/subscribable.js';
import type { Subscriber } from '../core/subscriber.js';
import { InternalSubscriber } from '../core/subscriber_impl.js';

export type TransformerFn<TInput, TOutput> = (value: TInput) => TOutput;

class MapSubscriber<TInput, TOutput> extends InternalSubscriber<TInput> {
    private _observer: Subscriber<TOutput>;
    private _transformer: TransformerFn<TInput, TOutput>;

    constructor(destination: Subscriber<TOutput>, transformer: TransformerFn<TInput, TOutput>) {
        super();
        this._observer = destination;
        this._transformer = transformer;
    }

    protected override onNext(value: TInput): void {
        const result = this._transformer(value);
        this._observer.next(result);
    }

    protected override onError(error: unknown): void {
        this._observer.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class MapObservable<TInput, TOutput> extends OperatorObservable<TInput, TOutput> {
    private transformer: TransformerFn<TInput, TOutput>;

    constructor(source: Observable<TInput>, transformer: TransformerFn<TInput, TOutput>) {
        super(source);
        this.transformer = transformer;
    }

    protected override onSubscribe(destination: Subscriber<TOutput>): Unsubscribable {
        const innerSub = new MapSubscriber(destination, this.transformer);
        const s = this.source.subscribe(innerSub);
        return s;
    }
}

export function map<TInput, TOutput>(transformer: TransformerFn<TInput, TOutput>): OperatorFunction<TInput, TOutput> {
    const operator: OperatorFunction<TInput, TOutput> = (source: Observable<TInput>) => {
        const mapped: Observable<TOutput> = new MapObservable<TInput, TOutput>(source, transformer);
        return mapped;
    };
    return operator;
}
