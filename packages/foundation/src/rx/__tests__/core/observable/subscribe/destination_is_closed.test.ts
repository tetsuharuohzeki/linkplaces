/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { TestObservable, TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(6);

    // setup
    const onSubscribe = tinyspy.spy();
    const testTarget = new TestObservable<number>(onSubscribe);
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
    t.is(onSubscribe.callCount, 0, 'onSubscribe should not called');
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    // teardown
    t.is(subscription.closed, true);
});
