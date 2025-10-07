/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { SubscriptionError } from '../../../../mod.js';
import { TestObservable, TestSubscriber } from '../../../__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(6);

    // setup
    const onSubscribe = tinyspy.spy();
    const testTarget = new TestObservable<number>(onSubscribe);
    const destination = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    destination.unsubscribe();
    t.is(destination.closed, true, 'observer should be closed before act');
    t.throws(() => testTarget.subscribe(destination), {
        instanceOf: SubscriptionError,
        message: 'subscriber has been closed',
    });

    // assertion
    t.is(onSubscribe.callCount, 0, 'should not call onSubscribe');
    t.is(onNext.callCount, 0, 'should not call onNext');
    t.is(onError.callCount, 0, 'should not call onError');
    t.is(onCompleted.callCount, 0, 'should not call onCompleted');
});
