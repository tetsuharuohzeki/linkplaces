/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject, createCompletionOk } from '../../../../mod.js';

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', (t) => {
    t.plan(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
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

    testTarget.next(SECOND_VALUE);
    testTarget.error(new Error());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);

    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
