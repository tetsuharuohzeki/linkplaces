import test from 'ava';
import { spy } from 'tinyspy';

import { BehaviorSubject, createCompletionOk } from '../../../mod.js';

test('.complete() should propagate it to the child', (t) => {
    const INPUT = createCompletionOk();

    const target = new BehaviorSubject<number>(0);
    const onCompleted = spy();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);
});

test('.complete() should stop myself', (t) => {
    const INPUT = createCompletionOk();
    const INITIAL_INPUT = 0;
    const NORMAL_INPUT = Math.random();

    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = spy();
    const onCompleted = spy();
    target.asObservable().subscribeBy({
        onNext: onNext,
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_INPUT],
    ]);
});

test('.complete() should flip its flag at the first on calling it', (t) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    t.plan(4);

    const INPUT = createCompletionOk();

    const target = new BehaviorSubject<number>(0);
    const onCompleted = spy(() => {
        t.is(target.isCompleted, true);
    });
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.complete(INPUT);

    t.is(target.isCompleted, true);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [[INPUT]]);
});

test('.complete() should propagate the passed value on reentrant case', (t) => {
    const INPUT = createCompletionOk();

    // arrange
    const target = new BehaviorSubject<number>(0);
    const onInnerComplete = spy();
    const onOuterComplete = spy(() => {
        target.asObservable().subscribeBy({
            onCompleted: onInnerComplete,
        });
    });

    // act
    target.asObservable().subscribeBy({
        onCompleted: onOuterComplete,
    });

    target.complete(INPUT);

    // assert
    t.is(target.isCompleted, true);

    t.is(onOuterComplete.callCount, 1);
    t.deepEqual(onOuterComplete.calls, [[INPUT]]);

    t.is(onInnerComplete.callCount, 1);
    t.deepEqual(onInnerComplete.calls, [[INPUT]]);
});
