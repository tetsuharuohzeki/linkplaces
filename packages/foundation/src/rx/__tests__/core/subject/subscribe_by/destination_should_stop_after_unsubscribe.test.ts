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
    const onComplete = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    testTarget.next();
    testTarget.errorResume(new Error());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onComplete.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
