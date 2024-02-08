import type { Observable } from '../observable.js';
import type { CompletionResult, Observer } from '../observer.js';
import { OperatorObservable, type OperatorFunction } from '../operator.js';
import type { Unsubscribable } from '../subscribable.js';
import { Subscriber } from '../subscriber.js';

export type FilterFn<T> = (value: T) => boolean;

class FilterSubscriber<T> extends Subscriber<T> {
    private _observer: Observer<T>;
    private _filter: FilterFn<T>;

    constructor(observer: Observer<T>, filter: FilterFn<T>) {
        super();
        this._observer = observer;
        this._filter = filter;
    }

    protected override onNext(value: T): void {
        const ok = this._filter(value);
        if (ok) {
            this._observer.next(value);
        }
    }

    protected override onErrorResume(error: unknown): void {
        this._observer.errorResume(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class FilterObservable<T> extends OperatorObservable<T, T> {
    private filter: FilterFn<T>;

    constructor(source: Observable<T>, transformer: FilterFn<T>) {
        super(source);
        this.filter = transformer;
    }

    protected override onSubscribe(observer: Observer<T>): Unsubscribable {
        const innerSub = new FilterSubscriber(observer, this.filter);
        const s = this.source.subscribe(innerSub);
        return s;
    }
}

export function filter<T>(transformer: FilterFn<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const mapped: Observable<T> = new FilterObservable<T>(source, transformer);
        return mapped;
    };
    return operator;
}
