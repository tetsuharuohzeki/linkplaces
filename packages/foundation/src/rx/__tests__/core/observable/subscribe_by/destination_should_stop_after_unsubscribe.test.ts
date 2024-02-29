/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Subscriber, createCompletionOk } from '../../../../mod.js';

import { TestObservable } from './__helpers__/mod.js';

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', (t) => {
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
    const onComplete = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    });
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.errorResume(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createCompletionOk());

    // assert
    t.is(onUnsubscribe.callCount, 1);
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onComplete.callCount, 0);
});
