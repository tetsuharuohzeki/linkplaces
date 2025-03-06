/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject } from '../../../../mod.js';

const spiedReportError = tinyspy.spy();

test.before(() => {
    globalThis.reportError = spiedReportError;
});

test.beforeEach(() => {
    spiedReportError.reset();
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onNext()', (t) => {
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const onNext = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.next(SECOND_VALUE);

    // assert
    t.is(onNext.callCount, 2);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
        [SECOND_VALUE],
    ]);
    t.deepEqual(onNext.results, [
        ['error', THROWN_ERROR],
        ['error', THROWN_ERROR],
    ]);

    t.is(onError.callCount, 2);
    t.deepEqual(onError.calls, [[THROWN_ERROR], [THROWN_ERROR]]);

    t.is(onCompleted.callCount, 0);

    t.is(subscription.closed, false);
    t.is(testTarget.isCompleted, false);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onError', (t) => {
    const INITIAL_VALUE = Math.random();
    const INPUT_ERROR = new Error(String(Math.random()));
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.error(INPUT_ERROR);

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INITIAL_VALUE]]);

    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[INPUT_ERROR]]);
    t.deepEqual(onError.results, [['error', THROWN_ERROR]]);

    t.is(onCompleted.callCount, 0);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR]]);

    t.is(subscription.closed, false);
    t.is(testTarget.isCompleted, false);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onCompleted', (t) => {
    const INITIAL_VALUE = Math.random();
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });

    // act
    const subscription = testTarget.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.complete(null);
    testTarget.complete(null);

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 1);
    t.deepEqual(onCompleted.calls, [
        // @prettier-ignore
        [null],
    ]);
    t.deepEqual(onCompleted.results, [['error', THROWN_ERROR]]);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [
        // @prettier-ignore
        [THROWN_ERROR],
    ]);

    t.is(subscription.closed, true);
    t.is(testTarget.isCompleted, true);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onNext -> onError', (t) => {
    const INITIAL_VALUE = 'init:' + Math.random();
    const SECOND_VALUE = 'second:' + Math.random();
    const THROWN_ERROR_ON_NEXT_CB = new Error('next: ' + String(Math.random()));
    const THROWN_ERROR_ON_ERROR_CB = new Error('error: ' + String(Math.random()));

    // setup
    const testTarget = new BehaviorSubject(INITIAL_VALUE);
    const onNext = tinyspy.spy(() => {
        throw THROWN_ERROR_ON_NEXT_CB;
    });
    const onError = tinyspy.spy(() => {
        throw THROWN_ERROR_ON_ERROR_CB;
    });
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.asObservable().subscribeBy({
        onNext: onNext,
        onError: onError,
        onCompleted: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.next(SECOND_VALUE);

    // assert
    t.is(onNext.callCount, 2, '.next should be called');
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
        [SECOND_VALUE],
    ]);
    t.deepEqual(onNext.results, [
        // @prettier-ignore
        ['error', THROWN_ERROR_ON_NEXT_CB],
        ['error', THROWN_ERROR_ON_NEXT_CB],
    ]);

    t.is(onError.callCount, 2);
    t.deepEqual(onError.calls, [
        // @prettier-ignore
        [THROWN_ERROR_ON_NEXT_CB],
        [THROWN_ERROR_ON_NEXT_CB],
    ]);
    t.deepEqual(onError.results, [
        // @prettier-ignore
        ['error', THROWN_ERROR_ON_ERROR_CB],
        ['error', THROWN_ERROR_ON_ERROR_CB],
    ]);

    t.is(onCompleted.callCount, 0, '.complete should not be called');

    t.is(spiedReportError.callCount, 2);
    t.deepEqual(spiedReportError.calls, [
        // @prettier-ignore
        [THROWN_ERROR_ON_ERROR_CB],
        [THROWN_ERROR_ON_ERROR_CB],
    ]);

    t.is(subscription.closed, false);
    t.is(testTarget.isCompleted, false);
});
