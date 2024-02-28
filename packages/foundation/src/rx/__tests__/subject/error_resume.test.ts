import { expect, test, vitest } from 'vitest';
import { Subject } from '../../mod.js';

test('.errorResume() should propagate the passed value to the child', () => {
    const ERROR_INPUT = new Error();

    const target = new Subject<number>();

    const onNext = vitest.fn();
    const onError = vitest.fn();
    target.subscribeBy({
        next: onNext,
        errorResume: onError,
    });

    target.errorResume(ERROR_INPUT);

    expect(target.isCompleted).toBe(false);
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toBeCalledWith(ERROR_INPUT);
});

test('.errorResume() should not stop myself', () => {
    const ERROR_INPUT = new Error();
    const NORMAL_INPUT = Math.random();

    const target = new Subject<number>();

    const onNext = vitest.fn();
    const onError = vitest.fn();
    target.subscribeBy({
        next: onNext,
        errorResume: onError,
    });

    target.errorResume(ERROR_INPUT);

    expect(target.isCompleted).toBe(false);
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toBeCalledWith(ERROR_INPUT);

    target.next(NORMAL_INPUT);
    expect(onNext).toHaveBeenCalledOnce();
    expect(onNext).toBeCalledWith(NORMAL_INPUT);
});

test('.errorResume() should propagate the passed value but not reentrant', () => {
    const ERROR_INPUT = new Error();

    const target = new Subject<number>();
    const innerOnError = vitest.fn();
    const outerOnError = vitest.fn((_value) => {
        target.subscribeBy({
            errorResume: innerOnError,
        });
    });
    target.subscribeBy({
        errorResume: outerOnError,
    });

    target.errorResume(ERROR_INPUT);

    expect(outerOnError).toHaveBeenCalledOnce();
    expect(outerOnError).toBeCalledWith(ERROR_INPUT);

    expect(innerOnError).toBeCalledTimes(0);
});
