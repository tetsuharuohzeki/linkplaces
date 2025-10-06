import type { CompletionResult } from '../core/completion_result.js';
import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import { InternalSubscriber } from '../core/subscriber_impl.js';

export type FilterFn<T> = (value: T) => boolean;

class FilterSubscriber<T> extends InternalSubscriber<T> {
    private _observer: Subscriber<T>;
    private _filter: FilterFn<T>;

    constructor(destination: Subscriber<T>, filter: FilterFn<T>) {
        super();
        this._observer = destination;
        this._filter = filter;
    }

    protected override onNext(value: T): void {
        const ok = this._filter(value);
        if (ok) {
            this._observer.next(value);
        }
    }

    protected override onError(error: unknown): void {
        this._observer.error(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class FilterObservable<T> extends OperatorObservable<T, T> {
    private filter: FilterFn<T>;

    constructor(source: Observable<T>, filter: FilterFn<T>) {
        super(source);
        this.filter = filter;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const innerSub = new FilterSubscriber(destination, this.filter);
        this.source.subscribe(innerSub);
    }
}

export function filter<T>(transformer: FilterFn<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const mapped: Observable<T> = new FilterObservable<T>(source, transformer);
        return mapped;
    };
    return operator;
}
