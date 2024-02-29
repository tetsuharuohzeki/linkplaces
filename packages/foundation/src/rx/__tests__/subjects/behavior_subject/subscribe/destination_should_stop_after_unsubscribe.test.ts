/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Observer, createCompletionOk, BehaviorSubject } from '../../../../mod.js';

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', (t) => {
    t.plan(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = {
        next: tinyspy.spy(),
        errorResume: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    testTarget.next(SECOND_VALUE);
    testTarget.errorResume(new Error());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(observer.next.callCount, 1);
    t.deepEqual(observer.next.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    t.is(observer.errorResume.callCount, 0);
    t.is(observer.complete.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
