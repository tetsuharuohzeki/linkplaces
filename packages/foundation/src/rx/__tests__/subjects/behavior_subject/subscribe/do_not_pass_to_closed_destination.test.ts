/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject,  } from '../../../../mod.js';

import { TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', (t) => {
    t.plan(7);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    t.is(observer.isActive(), true);
    const subscription = testTarget.asObservable().subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    observer.unsubscribe();
    t.is(observer.isActive(), false);

    testTarget.next(SECOND_VALUE);
    testTarget.error(new Error());
    testTarget.complete(null);

    // assertion
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    t.is(testTarget.hasActive, false, 'testTarget.hasActive');
});
