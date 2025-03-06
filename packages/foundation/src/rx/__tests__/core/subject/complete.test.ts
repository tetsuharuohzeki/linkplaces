import test from 'ava';
import * as tinyspy from 'tinyspy';
import { Subject } from '../../../mod.js';

test('.complete() should propagate it to the child', (t) => {
    const target = new Subject<number>();
    const onCompleted = tinyspy.spy();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(null);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[null]]);
});

test('.complete() should stop myself', (t) => {
    const NORMAL_INPUT = Math.random();

    const target = new Subject<number>();
    const onNext = tinyspy.spy();
    const onCompleted = tinyspy.spy();
    target.asObservable().subscribeBy({
        onNext: onNext,
        onCompleted: onCompleted,
    });

    target.complete(null);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[null]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 0);
});

test('.complete() should flip its flag at the first on calling it', (t) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    t.plan(4);

    const target = new Subject<number>();
    const onCompleted = tinyspy.spy(() => {
        t.is(target.isCompleted, true);
    });
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(null);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[null]]);
});

test('.complete() should propagate the passed value on reentrant case', (t) => {
    // arrange
    const target = new Subject<number>();
    const onInnerComplete = tinyspy.spy();
    const onOuterComplete = tinyspy.spy(() => {
        target.asObservable().subscribeBy({
            onCompleted: onInnerComplete,
        });
    });

    // act
    target.asObservable().subscribeBy({
        onCompleted: onOuterComplete,
    });

    target.complete(null);

    // assert
    t.is(target.isCompleted, true);

    t.is(onOuterComplete.callCount, 1);
    t.deepEqual(onOuterComplete.calls, [[null]]);

    t.is(onInnerComplete.callCount, 1);
    t.deepEqual(onOuterComplete.calls, [[null]]);
});
