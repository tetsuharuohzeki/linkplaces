/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { spy } from 'tinyspy';
import { BehaviorSubject } from '../../../mod.js';

test('.error() should propagate the passed value to the child', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();

    const target = new BehaviorSubject<number>(INITIAL_INPUT);

    const onNext = spy();
    const onError = spy();
    target.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
    });

    target.error(ERROR_INPUT);

    t.is(target.hasActive, true, 'target.hasActive');
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);
});

test('.error() should not stop myself', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();
    const NORMAL_INPUT = Math.random();
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = spy();
    const onError = spy();

    // act
    const sub = target.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });

    target.error(ERROR_INPUT);

    t.is(target.hasActive, true, 'target.hasActive');
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 2);
    t.deepEqual(onNext.calls, [[INITIAL_INPUT], [NORMAL_INPUT]]);
});

test('.error() should propagate the passed value but not reentrant', (t) => {
    const INITIAL_INPUT = 0;
    const ERROR_INPUT = new Error();

    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const innerOnError = spy();
    const outerOnError = spy((_value) => {
        target.asObservable().subscribeBy({
            onError: innerOnError,
        });
    });
    const sub = target.asObservable().subscribeBy({
        onError: outerOnError,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });

    target.error(ERROR_INPUT);

    t.is(outerOnError.callCount, 1);
    t.deepEqual(outerOnError.calls, [[ERROR_INPUT]]);

    t.is(innerOnError.callCount, 0);
});
