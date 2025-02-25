import test from 'ava';
import { spy } from 'tinyspy';
import { OperatorObservable, type OperatorFunction } from '../../../core/operator.js';
import { InternalSubscriber } from '../../../core/subscriber_impl.js';
import { Subject, type Observable, type Subscriber, type CompletionResult, type Unsubscribable } from '../../../mod.js';

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

test('.pipe() should propagate the passed value to the child', (t) => {
    const source = new Subject<void>();
    const chained = source.asObservable().pipe(testOperator());

    const onNext = spy();
    const subscription = chained.subscribeBy({
        onNext: onNext,
    });
    source.next();
    source.next();
    source.next();

    // assert
    t.assert(chained instanceof TestObservable);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    t.is(onNext.callCount, 3);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [undefined],
        [undefined],
        [undefined],
    ]);

    // teardown
    subscription.unsubscribe();
    t.is(subscription.closed, true);
});
