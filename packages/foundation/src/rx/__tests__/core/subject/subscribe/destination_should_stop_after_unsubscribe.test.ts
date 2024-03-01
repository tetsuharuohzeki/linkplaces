/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Observer, createCompletionOk, Subject } from '../../../../mod.js';

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', (t) => {
    t.plan(5);

    // arrange
    const testTarget = new Subject<void>();
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<void>;

    // act
    const subscription = testTarget.subscribe(observer);
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    testTarget.next();
    testTarget.error(new Error());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
