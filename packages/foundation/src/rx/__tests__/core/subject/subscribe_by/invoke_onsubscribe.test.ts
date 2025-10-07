import test from 'ava';
import { spy } from 'tinyspy';
import { Subject } from '../../../../mod.js';

test('onSubscribe should be invoked by calling `.subscribe()`', (t) => {
    // arrange
    const testTarget = new Subject<void>();
    const onNext = spy();
    const onError = spy();
    const onCompleted = spy();

    // act
    const subscription = testTarget.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);
    t.is(subscription.closed, false);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);

    t.is(testTarget.hasActive, true, 'testTarget.hasActive');
});
