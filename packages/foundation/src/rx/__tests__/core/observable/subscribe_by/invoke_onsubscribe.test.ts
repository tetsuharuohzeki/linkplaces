import test from 'ava';
import { spy } from 'tinyspy';

import { TestObservable } from '../../../__helpers__/mod.js';

test('onSubscribe should be invoked by calling `.subscribe()`', (t) => {
    // arrange
    const onSubscribeFn = spy();
    const testTarget = new TestObservable<number>(onSubscribeFn);
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
    t.is(onSubscribeFn.callCount, 1);
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);
    t.is(subscription.closed, false);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);
});
