import test from 'ava';
import { createOk } from 'option-t/plain_result';
import * as tinyspy from 'tinyspy';
import { Subject } from '../../../mod.js';

test('.complete() should propagate it to the child', (t) => {
    const INPUT = createOk<void>(undefined);

    const target = new Subject<number>();
    const onCompleted = tinyspy.spy();
    target.subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);
});

test('.complete() should stop myself', (t) => {
    const INPUT = createOk<void>(undefined);
    const NORMAL_INPUT = Math.random();

    const target = new Subject<number>();
    const onNext = tinyspy.spy();
    const onCompleted = tinyspy.spy();
    target.subscribeBy({
        onNext: onNext,
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 0);
});

test('.complete() should flip its flag at the first on calling it', (t) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    t.plan(4);

    const INPUT = createOk<void>(undefined);

    const target = new Subject<number>();
    const onCompleted = tinyspy.spy(() => {
        t.is(target.isCompleted, true);
    });
    target.subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);
});

test('.complete() should propagate the passed value on reentrant case', (t) => {
    const INPUT = createOk<void>(undefined);

    // arrange
    const target = new Subject<number>();
    const onInnerComplete = tinyspy.spy();
    const onOuterComplete = tinyspy.spy(() => {
        target.subscribeBy({
            onCompleted: onInnerComplete,
        });
    });

    // act
    target.subscribeBy({
        onCompleted: onOuterComplete,
    });

    target.complete(INPUT);

    // assert
    t.is(target.isCompleted, true);

    t.is(onOuterComplete.callCount, 1);
    t.deepEqual(onOuterComplete.calls, [[INPUT]]);

    t.is(onInnerComplete.callCount, 1);
    t.deepEqual(onOuterComplete.calls, [[INPUT]]);
});
