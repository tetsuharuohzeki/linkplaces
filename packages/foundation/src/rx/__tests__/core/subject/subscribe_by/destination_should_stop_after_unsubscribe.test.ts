/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { createCompletionOk, Subject } from '../../../../mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(5);

    // arrange
    const subject = new Subject<void>();
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy();

    // act
    const subscription = subject.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true, 'subscription should be closed here');

    subject.next();
    subject.error(new Error());
    subject.complete(createCompletionOk());

    // assert
    t.is(onNext.callCount, 0, 'should not call next callback');
    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');

    t.is(subject.isCompleted, true, 'subject should be completed');
});
