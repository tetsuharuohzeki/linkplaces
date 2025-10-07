/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';
import { OperatorObservable, type OperatorFunction } from '../../../core/operator.js';
import { InternalSubscriber } from '../../../core/subscriber_impl.js';
import {
    BehaviorSubject,
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

    protected override onError(error: unknown): void {
        this._observer.error(error);
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
        const s = this._source.subscribe(innerSub);
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

test('.pipe() should propagate the passed value to the child', (t) => {
    const source = new BehaviorSubject<number>(1);
    const chained = source.asObservable().pipe(testOperator());

    const onNext = tinyspy.spy<[number], void>();
    const subscription = chained.subscribeBy({
        onNext: onNext,
    });
    source.next(2);
    source.next(3);
    source.next(4);

    // assert
    t.assert(chained instanceof TestObservable);
    t.is(onNext.callCount, 4);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [1],
        [2],
        [3],
        [4],
    ]);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);
});
