import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest } from 'vitest';
import { Subject } from '../../mod.js';

test('.unsubscribe() should stop myself', () => {
    const sub = new Subject();
    sub.unsubscribe();
    expect(sub.isCompleted).toBe(true);
});

test('.unsubscribe() should stop subscriptions by myself', () => {
    const parent = new Subject<number>();
    const target = new Subject<number>();
    const onNext = vitest.fn();
    target.subscribeBy({
        next: onNext,
    });

    parent.subscribe(target);
    target.unsubscribe();
    parent.next(Math.random());

    expect(onNext).toBeCalledTimes(0);
});

test('.unsubscribe() should stop it if myself is subscribed from others', () => {
    const target = new Subject<void>();
    const onNext = vitest.fn();
    target.subscribeBy({
        next: onNext,
    });

    target.unsubscribe();
    target.next();

    expect(onNext).toBeCalledTimes(0);
});

test('.unsubscribe() should not behave on calling it twice', () => {
    const target = new Subject();
    const onComplete = vitest.fn();
    target.subscribeBy({
        complete: onComplete,
    });

    target.unsubscribe();
    target.unsubscribe();

    expect(onComplete).toHaveBeenCalledTimes(1);
});

test('.unsubscribe() should not reentrant', () => {
    const target = new Subject();
    const innerOnComplete = vitest.fn();
    const outerOnComplete = vitest.fn(() => {
        target.subscribeBy({
            complete: innerOnComplete,
        });
    });
    target.subscribeBy({
        complete: outerOnComplete,
    });
    target.unsubscribe();

    expect(outerOnComplete).toHaveBeenCalledOnce();
    expect(innerOnComplete).toHaveBeenCalledTimes(0);
});

test('.unsubscribe() should emit the completion to children', () => {
    const target = new Subject<number>();
    const onComplete = vitest.fn();
    target.subscribeBy({
        complete: onComplete,
    });

    target.unsubscribe();

    expect(onComplete).toBeCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(createOk(undefined));
});
