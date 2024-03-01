/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { createCompletionOk, Subject } from '../../../../mod.js';

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', (t) => {
    t.plan(5);

    // arrange
    const testTarget = new Subject<void>();
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

    testTarget.next();
    testTarget.error(new Error());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
