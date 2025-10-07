/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject } from '../../../../mod.js';

test("the returned subscription's .unsubscribe() should propagate to the source", (t) => {
    t.plan(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);

    // act
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    };
    const subscription = testTarget.asObservable().subscribe(observer);
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // assert
    t.is(observer.next.callCount, 1);
    t.deepEqual(observer.next.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);

    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);

    t.is(testTarget.hasActive, false, 'testTarget.hasActive');
});
