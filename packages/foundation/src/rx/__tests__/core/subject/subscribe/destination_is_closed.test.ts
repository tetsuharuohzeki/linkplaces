/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject, SubscriptionError } from '../../../../mod.js';
import { TestSubscriber } from '../../../__helpers__/mod.js';

test('if the passed destination is closed', (t) => {
    t.plan(5);

    // setup
    const testTarget = new Subject<number>();
    const destination = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    destination.unsubscribe();
    t.is(destination.closed, true, 'observer should be closed before act');
    t.throws(() => {
        testTarget.asObservable().subscribe(destination)
    }, {
        instanceOf: SubscriptionError,
        message: 'subscriber has been closed',
    });

    // assertion
    t.is(onNext.callCount, 0, 'should not call onNext');
    t.is(onError.callCount, 0, 'should not call onError');
    t.is(onCompleted.callCount, 0, 'should not call onCompleted');
});
