import { expect, test, vitest } from 'vitest';
import { OperatorObservable, type OperatorFunction } from '../../../core/operator.js';
import { InternalSubscriber } from '../../../core/subscriber_impl.js';
import {
    createObservable,
    type Observable,
    type Subscriber,
    type CompletionResult,
    type Unsubscribable,
} from '../../../mod.js';

class TestSubscriber<T> extends InternalSubscriber<T> {
    private _observer: Subscriber<T>;

    constructor(destination: Subscriber<T>) {
        super();
        this._observer = destination;
    }

    protected override onNext(value: T): void {
        this._observer.next(value);
    }

    protected override onErrorResume(error: unknown): void {
        this._observer.errorResume(error);
    }

    protected override onCompleted(result: CompletionResult): void {
        this._observer.complete(result);
    }
}

class TestObservable<T> extends OperatorObservable<T, T> {
    constructor(source: Observable<T>) {
        super(source);
    }

    protected override onSubscribe(destination: Subscriber<T>): Unsubscribable {
        const innerSub = new TestSubscriber(destination);
        const s = this.source.subscribe(innerSub);
        return s;
    }
}

export function testOperator<T>(): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const mapped: Observable<T> = new TestObservable<T>(source);
        return mapped;
    };
    return operator;
}

test('.pipe() should propagate the passed value to the child', () => {
    const source = createObservable<void>((destination) => {
        destination.next();
        destination.next();
        destination.next();
    });
    const chained = source.pipe(testOperator());

    const onNext = vitest.fn();
    const subscription = chained.subscribeBy({
        next: onNext,
    });

    // assert
    expect(chained).instanceOf(TestObservable);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(onNext).toHaveBeenCalledTimes(3);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [undefined],
        [undefined],
        [undefined],
    ]);

    // teardown
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);
});
