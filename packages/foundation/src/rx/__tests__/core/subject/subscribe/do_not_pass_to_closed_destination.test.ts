/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { createCompletionOk, Subject } from '../../../../mod.js';

import { TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', (t) => {
    t.plan(6);

    // arrange
    const testTarget = new Subject<void>();
    const observer = new TestSubscriber<void>();
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

    testTarget.next();
    testTarget.error(new Error());
    testTarget.complete(createCompletionOk());

    // assertion
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);

    t.is(testTarget.isCompleted, true);
});
