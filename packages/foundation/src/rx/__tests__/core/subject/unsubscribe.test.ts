import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject, createCompletionOk } from '../../../mod.js';

test('.unsubscribe() should stop myself', (t) => {
    const sub = new Subject();
    sub.unsubscribe();
    t.is(sub.isCompleted, true);
});

test('.unsubscribe() should stop subscriptions by myself', (t) => {
    const parent = new Subject<number>();
    const target = new Subject<number>();
    const onNext = tinyspy.spy();
    target.subscribeBy({
        next: onNext,
    });

    parent.subscribe(target);
    target.unsubscribe();
    parent.next(Math.random());

    t.is(onNext.callCount, 0);
});

test('.unsubscribe() should stop it if myself is subscribed from others', (t) => {
    const target = new Subject<void>();
    const onNext = tinyspy.spy();
    target.subscribeBy({
        next: onNext,
    });

    target.unsubscribe();
    target.next();

    t.is(onNext.callCount, 0);
});

test('.unsubscribe() should not behave on calling it twice', (t) => {
    const target = new Subject();
    const onCompleted = tinyspy.spy();
    target.subscribeBy({
        complete: onCompleted,
    });

    target.unsubscribe();
    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
});

test('.unsubscribe() should not reentrant', (t) => {
    const target = new Subject();
    const innerOnComplete = tinyspy.spy();
    const outerOnComplete = tinyspy.spy(() => {
        target.subscribeBy({
            complete: innerOnComplete,
        });
    });
    target.subscribeBy({
        complete: outerOnComplete,
    });
    target.unsubscribe();

    t.is(outerOnComplete.callCount, 1);
    t.is(innerOnComplete.callCount, 0);
});

test('.unsubscribe() should emit the completion to children', (t) => {
    const target = new Subject<number>();
    const onCompleted = tinyspy.spy();
    target.subscribeBy({
        complete: onCompleted,
    });

    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[createCompletionOk()]]);
});
