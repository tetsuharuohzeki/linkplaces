/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject, type Observer } from '../../../../mod.js';

test("the returned subscription's .unsubscribe() should propagate to the source", (t) => {
    t.plan(5);

    // arrange
    const testTarget = new Subject<void>();

    // act
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<void>;
    const subscription = testTarget.asObservable().subscribe(observer);
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // assert
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);

    t.is(testTarget.hasActive, true, 'testTarget.hasActive');
});
