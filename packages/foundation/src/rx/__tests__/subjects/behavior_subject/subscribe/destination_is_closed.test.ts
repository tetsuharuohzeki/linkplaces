/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject, SubscriptionError, createCompletionOk } from '../../../../mod.js';
import { TestSubscriber } from './__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(5);

    // setup
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const destination = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    destination.unsubscribe();
    t.is(destination.closed, true, 'observer should be closed before act');
    t.throws(() => testTarget.asObservable().subscribe(destination), {
        instanceOf: SubscriptionError,
        message: 'subscriber has been closed',
    });

    testTarget.next(SECOND_VALUE);
    testTarget.error(new Error());
    testTarget.complete(createCompletionOk());

    // assertion
    t.is(onNext.callCount, 0, 'should not call onNext');
    t.is(onError.callCount, 0, 'should not call onError');
    t.is(onCompleted.callCount, 0, 'should not call onCompleted');
});
