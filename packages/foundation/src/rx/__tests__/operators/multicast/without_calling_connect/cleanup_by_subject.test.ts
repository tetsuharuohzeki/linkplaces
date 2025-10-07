import test from 'ava';
import * as tinyspy from 'tinyspy';
import { Subject, operators } from '../../../../mod.js';
import { TestObservable } from '../../../__helpers__/mod.js';

test('if the given subject calls .unsubscribe(), subscribe chain should be cleared', (t) => {
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
    subject.unsubscribe();

    // assert
    t.is(onSourceTeardown.callCount, 0, 'onSourceTeardown.callCount');
    t.is(onObserverCompleted.callCount, 1, 'onObserverCompleted.callCount');
    t.is(subject.hasActive, false, 'subject.hasActive');
    t.is(subscription.closed, true, 'subscription.closed');
});

test('if the given subject calls .unsubscribe(), multiple subscribe chain should be cleared', (t) => {
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
    subject.unsubscribe();

    // assert
    t.is(onSourceTeardown.callCount, 0, 'onSourceTeardown.callCount');

    t.is(onObserverCompleted1.callCount, 1, 'onObserverCompleted1.callCount');
    t.is(onObserverCompleted2.callCount, 1, 'onObserverCompleted2.callCount');

    t.is(subject.hasActive, false, 'subject.hasActive');

    t.is(subscription1.closed, true, 'subscription1.closed');
    t.is(subscription2.closed, true, 'subscription2.closed');
});
