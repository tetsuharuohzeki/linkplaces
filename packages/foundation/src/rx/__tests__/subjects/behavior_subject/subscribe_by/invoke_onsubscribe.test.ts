import test from 'ava';
import { spy } from 'tinyspy';
import { BehaviorSubject } from '../../../../mod.js';

test('onSubscribe should be invoked by calling `.subscribe()`', (t) => {
    // arrange
    const INITIAL_VALUE = Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);

    const onNext = spy();
    const onError = spy();
    const onCompleted = spy();

    // act
    const subscription = testTarget.subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INITIAL_VALUE]]);

    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);
    t.is(subscription.closed, false);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);

    t.is(testTarget.isCompleted, false);
});
