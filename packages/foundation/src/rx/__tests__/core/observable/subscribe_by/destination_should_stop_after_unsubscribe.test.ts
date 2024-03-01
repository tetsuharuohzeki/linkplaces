/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Subscriber, createCompletionOk } from '../../../../mod.js';

import { TestObservable } from './__helpers__/mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(7);

    // arrange
    let passedSubscriber: Subscriber<void>;
    const onUnsubscribe = tinyspy.spy(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        t.is(passedSubscriber!.isActive(), false);
    });
    const testTarget = new TestObservable<void>((destination) => {
        destination.addTeardown(onUnsubscribe);
        t.is(destination.isActive(), true);
        passedSubscriber = destination;
    });
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
    t.is(subscription.closed, true, 'subscription should be closed here');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.error(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createCompletionOk());

    // assert
    t.is(onUnsubscribe.callCount, 1, 'onUnsubscribe callcount');
    t.is(onNext.callCount, 0, 'should not call next callback');
    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');
});
