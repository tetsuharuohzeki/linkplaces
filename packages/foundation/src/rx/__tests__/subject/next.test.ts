import { expect, test, vitest } from 'vitest';
import { Subject } from '../../mod.js';

test('.next() should propagate the passed value to the child', () => {
    const target = new Subject<number>();
    const onNext = vitest.fn();
    target.subscribeBy({
        next: onNext,
    });

    const INPUT = Math.random();
    target.next(INPUT);
    expect(onNext).toHaveBeenCalledOnce();
    expect(onNext).toBeCalledWith(INPUT);
});

test('.next() should propagate the passed value but not reentrant', () => {
    const target = new Subject<number>();
    const innerOnNext = vitest.fn();
    const outerOnNext = vitest.fn((_value) => {
        target.subscribeBy({
            next: innerOnNext,
        });
    });
    target.subscribeBy({
        next: outerOnNext,
    });

    const INPUT = Math.random();
    target.next(INPUT);
    expect(outerOnNext).toHaveBeenCalledOnce();
    expect(outerOnNext).toBeCalledWith(INPUT);

    expect(innerOnNext).toBeCalledTimes(0);
});
