/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Subscriber } from '../../../../mod.js';

import { TestObservable, TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', (t) => {
    t.plan(7);

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        t.is(destination.isActive(), true);
        passedSubscriber = destination;
    });
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    t.is(observer.isActive(), true);
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    observer.unsubscribe();
    t.is(observer.isActive(), false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.error(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(null);

    // assertion
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    // teardown
    t.is(subscription.closed, true);
});
