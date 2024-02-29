/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { spy } from 'tinyspy';
import { BehaviorSubject } from '../../../mod.js';

test('.errorResume() should propagate the passed value to the child', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();

    const target = new BehaviorSubject<number>(INITIAL_INPUT);

    const onNext = spy();
    const onError = spy();
    target.subscribeBy({
        next: onNext,
        errorResume: onError,
    });

    target.errorResume(ERROR_INPUT);

    t.is(target.isCompleted, false);
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);
});

test('.errorResume() should not stop myself', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();
    const NORMAL_INPUT = Math.random();
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = spy();
    const onError = spy();

    // act
    const sub = target.subscribeBy({
        next: onNext,
        errorResume: onError,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });

    target.errorResume(ERROR_INPUT);

    t.is(target.isCompleted, false);
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 2);
    t.deepEqual(onNext.calls, [[INITIAL_INPUT], [NORMAL_INPUT]]);
});

test('.errorResume() should propagate the passed value but not reentrant', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();

    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const innerOnError = spy();
    const outerOnError = spy((_value) => {
        target.subscribeBy({
            errorResume: innerOnError,
        });
    });
    const sub = target.subscribeBy({
        errorResume: outerOnError,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });

    target.errorResume(ERROR_INPUT);

    t.is(outerOnError.callCount, 1);
    t.deepEqual(outerOnError.calls, [[ERROR_INPUT]]);

    t.is(innerOnError.callCount, 0);
});
