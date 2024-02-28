/* eslint-disable @typescript-eslint/no-magic-numbers */
import { expect, test, vitest } from 'vitest';
import { BehaviorSubject } from '../../../mod.js';

test('.next() should propagate the passed value to the child', () => {
    const INITIAL_INPUT = 0;
    const SECOND_INPUT = 1;

    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = vitest.fn();
    target.subscribeBy({
        next: onNext,
    });

    target.next(SECOND_INPUT);

    expect(onNext).toHaveBeenCalledTimes(2);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_INPUT],
        [SECOND_INPUT],
    ]);
});

test('.next() should propagate the passed value even if in reentrant', () => {
    // arrange
    const INITIAL_INPUT = 0;
    const SECOND_INPUT = 1;
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const innerOnNext = vitest.fn((_val) => {});
    const outerOnNext = vitest.fn((value) => {
        if (value === INITIAL_INPUT) {
            return;
        }

        target.subscribeBy({
            next: innerOnNext,
        });
    });

    // act
    target.subscribeBy({
        next: outerOnNext,
    });
    target.next(SECOND_INPUT);

    // assert
    expect(outerOnNext).toHaveBeenCalledTimes(2);
    expect(outerOnNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_INPUT],
        [SECOND_INPUT],
    ]);

    expect(innerOnNext).toBeCalledTimes(1);
    expect(innerOnNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [SECOND_INPUT],
    ]);
});
