import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject } from '../../../mod.js';

test('.unsubscribe() should stop myself', (t) => {
    const sub = new Subject();
    sub.unsubscribe();
    t.is(sub.hasActive, false);
});

test('.unsubscribe() should stop subscriptions by myself', (t) => {
    const parent = new Subject<number>();
    const target = new Subject<number>();
    const onNext = tinyspy.spy();
    target.asObservable().subscribeBy({
        onNext: onNext,
    });

    parent.asObservable().subscribe(target);
    target.unsubscribe();
    parent.next(Math.random());

    t.is(onNext.callCount, 0);
});

test('.unsubscribe() should stop it if myself is subscribed from others', (t) => {
    const target = new Subject<void>();
    const onNext = tinyspy.spy();
    target.asObservable().subscribeBy({
        onNext: onNext,
    });

    target.unsubscribe();
    target.next();

    t.is(onNext.callCount, 0);
});

test('.unsubscribe() should not behave on calling it twice', (t) => {
    const target = new Subject();
    const onCompleted = tinyspy.spy();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.unsubscribe();
    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
});

test('.unsubscribe() should not reentrant', (t) => {
    const target = new Subject();
    const innerOnComplete = tinyspy.spy();
    const outerOnComplete = tinyspy.spy(() => {
        target.asObservable().subscribeBy({
            onCompleted: innerOnComplete,
        });
    });
    target.asObservable().subscribeBy({
        onCompleted: outerOnComplete,
    });
    target.unsubscribe();

    t.is(outerOnComplete.callCount, 1);
    t.is(innerOnComplete.callCount, 0);
});

test('.unsubscribe() should emit the completion to children', (t) => {
    const target = new Subject<number>();
    const onCompleted = tinyspy.spy();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[null]]);
});
