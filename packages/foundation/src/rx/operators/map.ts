import { Observable } from '../observable.js';
import type { Observer } from '../observer.js';
import type { OperatorFunction } from '../operator.js';
import { Subscriber } from '../subscriber.js';

export type TransformerFn<TInput, TOutput> = (value: TInput) => TOutput;

class MapSubscriber<TInput, TOutput> extends Subscriber<TInput, TOutput> {
    private _transformer: TransformerFn<TInput, TOutput>;

    constructor(destination: Observer<TOutput>, transformer: TransformerFn<TInput, TOutput>) {
        super(destination);
        this._transformer = transformer;
    }

    override _next(value: TInput): void {
        const transformer = this._transformer;
        const result: TOutput = transformer(value);
        this.destination.next(result);
    }
}

class MapObservable<TInput, TOutput> extends Observable<TOutput> {
    constructor(source: Observable<TInput>, transformer: TransformerFn<TInput, TOutput>) {
        super((destination) => {
            const innerSub = new MapSubscriber(destination, transformer);
            const s = source.subscribe(innerSub);
            return s;
        });
    }
}

export function map<TInput, TOutput>(transformer: TransformerFn<TInput, TOutput>): OperatorFunction<TInput, TOutput> {
    const operator: OperatorFunction<TInput, TOutput> = (source: Observable<TInput>) => {
        const mapped: Observable<TOutput> = new MapObservable<TInput, TOutput>(source, transformer);
        return mapped;
    };
    return operator;
}
