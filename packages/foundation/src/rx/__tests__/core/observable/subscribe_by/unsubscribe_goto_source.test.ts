/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Subscriber } from '../../../../mod.js';
import { TestObservable } from './__helpers__/mod.js';

test("the returned subscription's .unsubscribe() should propagate to the source", (t) => {
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
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // assert
    t.is(onUnsubscribe.callCount, 1);
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);
});
