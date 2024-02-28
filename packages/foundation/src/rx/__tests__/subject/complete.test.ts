import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest } from 'vitest';
import { Subject } from '../../mod.js';

test('.complete() should propagate it to the child', () => {
    const INPUT = createOk<void>(undefined);

    const target = new Subject<number>();
    const onComplete = vitest.fn();
    target.subscribeBy({
        complete: onComplete,
    });

    target.complete(INPUT);

    expect(target.isCompleted).toBe(true);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toBeCalledWith(INPUT);
});

test('.complete() should stop myself', () => {
    const INPUT = createOk<void>(undefined);
    const NORMAL_INPUT = Math.random();

    const target = new Subject<number>();
    const onNext = vitest.fn();
    const onComplete = vitest.fn();
    target.subscribeBy({
        next: onNext,
        complete: onComplete,
    });

    target.complete(INPUT);

    expect(target.isCompleted).toBe(true);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toBeCalledWith(INPUT);

    target.next(NORMAL_INPUT);
    expect(onNext).toHaveBeenCalledTimes(0);
});

test('.complete() should flip its flag at the first on calling it', () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect.assertions(4);

    const INPUT = createOk<void>(undefined);

    const target = new Subject<number>();
    const onComplete = vitest.fn(() => {
        expect(target.isCompleted).toBe(true);
    });
    target.subscribeBy({
        complete: onComplete,
    });

    target.complete(INPUT);

    expect(target.isCompleted).toBe(true);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toBeCalledWith(INPUT);
});

test('.complete() should propagate the passed value on reentrant case', () => {
    const INPUT = createOk<void>(undefined);

    // arrange
    const target = new Subject<number>();
    const onInnerComplete = vitest.fn();
    const onOuterComplete = vitest.fn(() => {
        target.subscribeBy({
            complete: onInnerComplete,
        });
    });

    // act
    target.subscribeBy({
        complete: onOuterComplete,
    });

    target.complete(INPUT);

    // assert
    expect(target.isCompleted).toBe(true);

    expect(onOuterComplete).toHaveBeenCalledOnce();
    expect(onOuterComplete).toBeCalledWith(INPUT);

    expect(onInnerComplete).toHaveBeenCalledTimes(1);
    expect(onOuterComplete).toBeCalledWith(INPUT);
});
