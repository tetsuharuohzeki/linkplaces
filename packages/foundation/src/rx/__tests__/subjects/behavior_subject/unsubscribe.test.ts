import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest } from 'vitest';
import { BehaviorSubject } from '../../../mod.js';

test('.unsubscribe() should stop myself', () => {
    const sub = new BehaviorSubject(0);
    sub.unsubscribe();
    expect(sub.isCompleted).toBe(true);
});

test('.unsubscribe() should stop subscriptions by myself', () => {
    const parent = new BehaviorSubject<number>(0);
    const target = new BehaviorSubject<number>(0);
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
    const target = new BehaviorSubject<void>(0);
    const onNext = vitest.fn();
    target.subscribeBy({
        next: onNext,
    });

    target.unsubscribe();
    target.next();

    expect(onNext).toBeCalledTimes(0);
});

test('.unsubscribe() should not behave on calling it twice', () => {
    const target = new BehaviorSubject(0);
    const onComplete = vitest.fn();
    target.subscribeBy({
        complete: onComplete,
    });

    target.unsubscribe();
    target.unsubscribe();

    expect(onComplete).toHaveBeenCalledTimes(1);
});

test('.unsubscribe() should not reentrant', () => {
    const target = new BehaviorSubject(0);
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
    const target = new BehaviorSubject<number>(0);
    const onComplete = vitest.fn();
    target.subscribeBy({
        complete: onComplete,
    });

    target.unsubscribe();

    expect(onComplete).toBeCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(createOk(undefined));
});
