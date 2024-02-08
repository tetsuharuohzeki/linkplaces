import type { Observable } from '../observable.js';
import type { CompletionResult, Observer } from '../observer.js';
import { OperatorObservable, type OperatorFunction } from '../operator.js';
import type { Unsubscribable } from '../subscribable.js';
import { Subscriber } from '../subscriber.js';

export type TransformerFn<TInput, TOutput> = (value: TInput) => TOutput;

class MapSubscriber<TInput, TOutput> extends Subscriber<TInput> {
    private _observer: Observer<TOutput>;
    private _transformer: TransformerFn<TInput, TOutput>;

    constructor(observer: Observer<TOutput>, transformer: TransformerFn<TInput, TOutput>) {
        super();
        this._observer = observer;
        this._transformer = transformer;
    }

    protected override onNext(value: TInput): void {
        const result = this._transformer(value);
        this._observer.next(result);
    }

    protected override onErrorResume(error: unknown): void {
        this._observer.errorResume(error);
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

    protected override onSubscribe(observer: Observer<TOutput>): Unsubscribable {
        const innerSub = new MapSubscriber(observer, this.transformer);
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
