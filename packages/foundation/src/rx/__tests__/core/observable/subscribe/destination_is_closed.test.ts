/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { TestObservable, TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(6);

    // setup
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new TestObservable<number>((destination) => {
        // FIXME: This should not be called.
        t.is(destination.isActive(), false);

        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                destination.errorResume(i);
            } else {
                destination.next(i);
            }
        }
    });
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onErrorResume');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    observer.unsubscribe();
    t.is(observer.isActive(), false, 'observer should be deactive before act');
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assertion
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    // teardown
    t.is(subscription.closed, true);
});
