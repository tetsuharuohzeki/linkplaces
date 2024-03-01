/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Observer, Subscriber } from '../../../../mod.js';
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

    // act
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<void>;
    const subscription = testTarget.subscribe(observer);
    subscription.unsubscribe();
    t.is(subscription.closed, true);

    // assert
    t.is(onUnsubscribe.callCount, 1);
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);
});
