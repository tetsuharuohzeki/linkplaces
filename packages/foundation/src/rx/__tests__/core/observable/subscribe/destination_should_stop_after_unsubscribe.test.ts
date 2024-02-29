/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Observer, type Subscriber, createCompletionOk } from '../../../../mod.js';

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

    // act
    const observer = {
        next: tinyspy.spy(),
        errorResume: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<void>;
    const subscription = testTarget.subscribe(observer);
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
    t.is(observer.next.callCount, 0);
    t.is(observer.errorResume.callCount, 0);
    t.is(observer.complete.callCount, 0);
});
