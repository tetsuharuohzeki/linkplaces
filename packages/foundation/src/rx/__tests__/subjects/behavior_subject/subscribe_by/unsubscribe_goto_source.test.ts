/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject } from '../../../../mod.js';

test("the returned subscription's .unsubscribe() should propagate to the source", (t) => {
    t.plan(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INITIAL_VALUE]]);

    t.is(onError.callCount, 0);

    t.is(onCompleted.callCount, 0);

    t.is(testTarget.isCompleted, false);
});
