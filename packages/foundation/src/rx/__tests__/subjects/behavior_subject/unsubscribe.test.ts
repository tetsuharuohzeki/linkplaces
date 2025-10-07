import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject, BehaviorSubject, type CompletionResult } from '../../../mod.js';

test('.unsubscribe() should stop myself', (t) => {
    const sub = new BehaviorSubject(0);
    sub.unsubscribe();
    t.false(sub.hasActive);
});

test('.unsubscribe() should stop subscriptions by myself', (t) => {
    const INITIAL_INPUT = Math.random();

    const parent = new Subject<number>();
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = tinyspy.spy<[number], void>();
    target.asObservable().subscribeBy({
        onNext: onNext,
    });

    parent.asObservable().subscribe(target);
    target.unsubscribe();
    const NOT_PROPAGED_INPUT = Math.random();
    parent.next(NOT_PROPAGED_INPUT);

    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls.at(0), [INITIAL_INPUT]);
});

test('.unsubscribe() should stop it if myself is subscribed from others', (t) => {
    const INITIAL_INPUT = Math.random();
    const target = new BehaviorSubject(INITIAL_INPUT);
    const onNext = tinyspy.spy<[number], void>();
    target.asObservable().subscribeBy({
        onNext: onNext,
    });

    target.unsubscribe();
    const NOT_PROPAGED_INPUT = Math.random();
    target.next(NOT_PROPAGED_INPUT);

    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INITIAL_INPUT]]);
});

test('.unsubscribe() should not behave on calling it twice', (t) => {
    const target = new BehaviorSubject(0);
    const onCompleted = tinyspy.spy<[CompletionResult], void>();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.unsubscribe();
    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
});

test('.unsubscribe() should not reentrant', (t) => {
    const target = new BehaviorSubject(0);
    const innerOnComplete = tinyspy.spy<[CompletionResult], void>();
    const outerOnComplete = tinyspy.spy<[CompletionResult], void>(() => {
        target.asObservable().subscribeBy({
            onCompleted: innerOnComplete,
        });
    });
    target.asObservable().subscribeBy({
        onCompleted: outerOnComplete,
    });
    target.unsubscribe();

    t.is(outerOnComplete.callCount, 1);
    t.is(innerOnComplete.callCount, 0);
});

test('.unsubscribe() should emit the completion to children', (t) => {
    const target = new BehaviorSubject<number>(0);
    const onCompleted = tinyspy.spy<[CompletionResult], void>();
    target.asObservable().subscribeBy({
        onCompleted: onCompleted,
    });

    target.unsubscribe();

    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls.at(0), [null]);
});
