/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import {  BehaviorSubject } from '../../../../mod.js';
import { TestSubscriber } from './__helpers__/mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(7);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const subject = new BehaviorSubject<number>(INITIAL_VALUE);
    const destination = new TestSubscriber();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    const subscription = subject.asObservable().subscribe(destination);
    subscription.unsubscribe();
    t.is(subscription.closed, true, 'subscription should be closed here');
    t.is(destination.closed, true, 'destination closed status');

    subject.next(SECOND_VALUE);
    subject.error(new Error());
    subject.complete(null);

    // assert
    t.is(onNext.callCount, 1, 'should call next calback');
    t.deepEqual(
        onNext.calls,
        [
            // @prettier-ignore
            [INITIAL_VALUE],
        ],
        'next callback input'
    );
    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');

    t.is(subject.isCompleted, true, 'subject should be completed');
});
