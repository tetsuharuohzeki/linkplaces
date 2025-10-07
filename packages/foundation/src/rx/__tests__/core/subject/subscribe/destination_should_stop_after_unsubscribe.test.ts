/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject } from '../../../../mod.js';
import { TestSubscriber } from './__helpers__/mod.js';

test('the destination should not be called after cancelled the subscription', (t) => {
    t.plan(6);

    // arrange
    const subject = new Subject<void>();
    const destination = new TestSubscriber();
    const onNext = tinyspy.spyOn(destination, 'onNext');
    const onError = tinyspy.spyOn(destination, 'onError');
    const onCompleted = tinyspy.spyOn(destination, 'onCompleted');

    // act
    const subscription = subject.asObservable().subscribe(destination);
    subscription.unsubscribe();
    t.is(subscription.closed, true, 'subscript should be closed here');
    t.is(destination.closed, true, 'destination closed status');

    subject.next();
    subject.error(new Error());
    subject.complete(null);

    // assert
    t.is(onNext.callCount, 0, 'should not call next callback');
    t.is(onError.callCount, 0, 'should not call error callback');
    t.is(onCompleted.callCount, 0, 'should not call complete callback');

    t.is(subject.hasActive, false, 'subject should be completed');
});
