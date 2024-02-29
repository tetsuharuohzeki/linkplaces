import { isNotNull, type Nullable } from 'option-t/esm/Nullable';
import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Unsubscribable } from '../core/subscribable.js';
import type { Subscriber } from '../core/subscriber.js';

class SubscribeOnNextLoopObservable<T> extends OperatorObservable<T, T> {
    constructor(source: Observable<T>) {
        super(source);
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        let actualSubscribe: Nullable<Unsubscribable> = null;
        const id = window.setTimeout(() => {
            actualSubscribe = this.source.subscribe(destination);
        }, 0);

        destination.addTeardown(() => {
            window.clearTimeout(id);
            if (isNotNull(actualSubscribe)) {
                actualSubscribe.unsubscribe();
            }
        });
    }
}

export function subscribeOnNextLoop<T>(): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const mapped: Observable<T> = new SubscribeOnNextLoopObservable<T>(source);
        return mapped;
    };
    return operator;
}
