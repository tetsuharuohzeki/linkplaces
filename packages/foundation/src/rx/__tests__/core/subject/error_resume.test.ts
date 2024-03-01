import test from 'ava';
import { spy } from 'tinyspy';
import { Subject } from '../../../mod.js';

test('.error() should propagate the passed value to the child', (t) => {
    const ERROR_INPUT = new Error();

    const target = new Subject<number>();

    const onNext = spy();
    const onError = spy();
    target.subscribeBy({
        onNext: onNext,
        onError: onError,
    });

    target.error(ERROR_INPUT);

    t.is(target.isCompleted, false);
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);
});

test('.error() should not stop myself', (t) => {
    const ERROR_INPUT = new Error();
    const NORMAL_INPUT = Math.random();

    const target = new Subject<number>();

    const onNext = spy();
    const onError = spy();
    target.subscribeBy({
        onNext: onNext,
        onError: onError,
    });

    target.error(ERROR_INPUT);

    t.is(target.isCompleted, false);
    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[ERROR_INPUT]]);

    target.next(NORMAL_INPUT);
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[NORMAL_INPUT]]);
});

test('.error() should propagate the passed value but not reentrant', (t) => {
    const ERROR_INPUT = new Error();

    const target = new Subject<number>();
    const innerOnError = spy();
    const outerOnError = spy((_value) => {
        target.subscribeBy({
            onError: innerOnError,
        });
    });
    target.subscribeBy({
        onError: outerOnError,
    });

    target.error(ERROR_INPUT);

    t.is(outerOnError.callCount, 1);
    t.deepEqual(outerOnError.calls, [[ERROR_INPUT]]);

    t.is(innerOnError.callCount, 0);
});
