import { isNotNull, unwrapNullable, type Nullable } from 'option-t/nullable';
import type { CompletionResult } from '../core/completion_result.js';
import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import { InternalSubscriber } from '../core/subscriber_impl.js';

export type AsyncTransformerFn<TInput, TOutput> = (value: TInput) => Promise<TOutput>;

class SwitchMapSubscriber<TInput, TOutput> extends InternalSubscriber<TInput> {
    private _observer: Subscriber<TOutput>;
    private _transformer: AsyncTransformerFn<TInput, TOutput>;
    private _latestAborter: Nullable<AbortController>;

    constructor(destination: Subscriber<TOutput>, transformer: AsyncTransformerFn<TInput, TOutput>) {
        super();
        this._observer = destination;
        this._transformer = transformer;
        this._latestAborter = null;
    }

    protected override onNext(value: TInput): void {
        const prevAborter = this._latestAborter;
        if (isNotNull(prevAborter)) {
            prevAborter.abort();
        }

        const aborter = new AbortController();
        this._latestAborter = aborter;

        let signal: Nullable<AbortSignal> = aborter.signal;
        (async () => {
            const result = await this._transformer(value);
            if (unwrapNullable(signal).aborted) {
                signal = null;
                return;
            }

            this._latestAborter = null;
            signal = null;

            this._observer.next(result);
        })().catch(console.error);
    }

    protected override onError(error: unknown): void {
        this._observer.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class SwitchMapObservable<TInput, TOutput> extends OperatorObservable<TInput, TOutput> {
    private transformer: AsyncTransformerFn<TInput, TOutput>;

    constructor(source: Observable<TInput>, transformer: AsyncTransformerFn<TInput, TOutput>) {
        super(source);
        this.transformer = transformer;
    }

    protected override onSubscribe(destination: Subscriber<TOutput>): void {
        const innerSub = new SwitchMapSubscriber(destination, this.transformer);
        this.source.subscribe(innerSub);
    }
}

export function switchMap<TInput, TOutput>(
    transformer: AsyncTransformerFn<TInput, TOutput>
): OperatorFunction<TInput, TOutput> {
    const operator: OperatorFunction<TInput, TOutput> = (source: Observable<TInput>) => {
        const mapped: Observable<TOutput> = new SwitchMapObservable<TInput, TOutput>(source, transformer);
        return mapped;
    };
    return operator;
}
