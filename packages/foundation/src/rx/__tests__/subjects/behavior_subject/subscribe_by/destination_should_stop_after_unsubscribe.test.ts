/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject, createCompletionOk } from '../../../../mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const subject = new BehaviorSubject<number>(INITIAL_VALUE);
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy();

    // act
    const subscription = subject.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true, 'subscription should be closed here');

    subject.next(SECOND_VALUE);
    subject.error(new Error());
    subject.complete(createCompletionOk());

    // assert
    t.is(onNext.callCount, 1, 'should call next calback');
    t.deepEqual(
        onNext.calls,
        [
            // @prettier-ignore
            [INITIAL_VALUE],
        ],
        'next callback input'
    );

    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');

    t.is(subject.isCompleted, true, 'subject should be completed');
});
