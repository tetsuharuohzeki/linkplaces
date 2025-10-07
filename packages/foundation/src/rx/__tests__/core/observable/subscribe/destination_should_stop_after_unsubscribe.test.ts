/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Subscriber } from '../../../../mod.js';

import { TestSubscriber, TestObservable } from '../../../__helpers__/mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(8);

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
    const destination = new TestSubscriber();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    const subscription = testTarget.subscribe(destination);
    subscription.unsubscribe();
    t.is(subscription.closed, true, 'subscription should be closed here');
    t.is(destination.closed, true, 'destination closed status');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.error(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(null);

    // assert
    t.is(onUnsubscribe.callCount, 1, 'onUnsubscribe callcount');
    t.is(onNext.callCount, 0, 'should not call next callback');
    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');
});
