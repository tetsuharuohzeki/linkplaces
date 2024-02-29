/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject, createCompletionOk } from '../../../../mod.js';
import { TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(6);

    // setup
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onErrorResume');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    observer.unsubscribe();
    t.is(observer.closed, true, 'observer should be deactive before act');
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.next(SECOND_VALUE);
    testTarget.errorResume(new Error());
    testTarget.complete(createCompletionOk());

    // assertion
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    // teardown
    t.is(subscription.closed, true);

    t.is(testTarget.isCompleted, true);
});
