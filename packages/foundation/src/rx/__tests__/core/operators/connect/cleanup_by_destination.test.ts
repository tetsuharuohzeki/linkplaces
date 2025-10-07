/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';
import { Subject, operators } from '../../../../mod.js';
import { TestObservable } from '../../../__helpers__/mod.js';

test('if the subscription is closed, subscribe chain should be cleared', (t) => {
    // setup
    const onSourceTeardown = tinyspy.spy();

    const subject = new Subject<number>();
    const source = new TestObservable<number>((destination) => {
        destination.addTeardown(onSourceTeardown);
    }).pipe(operators.multicast(subject));

    const onObserverCompleted = tinyspy.spy();

    // act
    const subscription = source.subscribeBy({
        onCompleted: onObserverCompleted,
    });
    subscription.unsubscribe();

    // assert
    t.is(onSourceTeardown.callCount, 1, 'onSourceTeardown.callCount');
    t.is(onObserverCompleted.callCount, 0, 'onObserverCompleted.callCount');
    t.is(subject.hasActive, false, 'subject.hasActive');
    t.is(subscription.closed, true, 'subscription.closed');
});

test('if the all subscription is closed, subscribe chain should be cleared', (t) => {
    // setup
    const onSourceTeardown = tinyspy.spy();

    const subject = new Subject<number>();
    const source = new TestObservable<number>((destination) => {
        destination.addTeardown(onSourceTeardown);
    }).pipe(operators.multicast(subject));

    const onObserverCompleted1 = tinyspy.spy();
    const onObserverCompleted2 = tinyspy.spy();

    // act
    const subscription1 = source.subscribeBy({
        onCompleted: onObserverCompleted1,
    });
    const subscription2 = source.subscribeBy({
        onCompleted: onObserverCompleted2,
    });
    subscription1.unsubscribe();
    subscription2.unsubscribe();

    // assert
    t.is(onSourceTeardown.callCount, 2, 'onSourceTeardown.callCount');

    t.is(onObserverCompleted1.callCount, 0, 'onObserverCompleted1.callCount');
    t.is(onObserverCompleted2.callCount, 0, 'onObserverCompleted2.callCount');

    t.is(subject.hasActive, false, 'subject.hasActive');

    t.is(subscription1.closed, true, 'subscription1.closed');
    t.is(subscription2.closed, true, 'subscription2.closed');
});

test('if the one of subscriptions is closed, subscribe chain should be cleared', (t) => {
    // setup
    const onSourceTeardown = tinyspy.spy();

    const subject = new Subject<number>();
    const source = new TestObservable<number>((destination) => {
        destination.addTeardown(onSourceTeardown);
    }).pipe(operators.multicast(subject));

    const onObserverCompleted1 = tinyspy.spy();
    const onObserverCompleted2 = tinyspy.spy();

    // act
    const subscription1 = source.subscribeBy({
        onCompleted: onObserverCompleted1,
    });
    const subscription2 = source.subscribeBy({
        onCompleted: onObserverCompleted2,
    });
    subscription1.unsubscribe();

    // assert
    t.is(onSourceTeardown.callCount, 1, 'onSourceTeardown.callCount');

    t.is(onObserverCompleted1.callCount, 0, 'onObserverCompleted1.callCount');
    t.is(onObserverCompleted2.callCount, 0, 'onObserverCompleted2.callCount');

    t.is(subject.hasActive, true, 'subject.hasActive');

    t.is(subscription1.closed, true, 'subscription1.closed');
    t.is(subscription2.closed, false, 'subscription2.closed');
});
