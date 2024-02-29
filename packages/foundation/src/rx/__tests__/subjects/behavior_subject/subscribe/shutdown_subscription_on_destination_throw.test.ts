/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Observer, createCompletionOk, BehaviorSubject } from '../../../../mod.js';

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
    const observer = {
        next: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
        errorResume: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.next(SECOND_VALUE);

    // assert
    t.is(observer.next.callCount, 2);
    t.deepEqual(observer.next.calls, [[INITIAL_VALUE], [SECOND_VALUE]]);
    t.deepEqual(observer.next.results, [
        ['error', THROWN_ERROR],
        ['error', THROWN_ERROR],
    ]);

    t.is(observer.errorResume.callCount, 2);
    t.deepEqual(observer.errorResume.calls, [[THROWN_ERROR], [THROWN_ERROR]]);

    t.is(observer.complete.callCount, 0);
    t.is(subscription.closed, false);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onError', (t) => {
    const INITIAL_VALUE = Math.random();
    const INPUT_ERROR = new Error(String(Math.random()));
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = {
        next: tinyspy.spy(),
        errorResume: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.errorResume(INPUT_ERROR);

    // assert
    t.is(observer.next.callCount, 1);
    t.deepEqual(observer.next.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);

    t.is(observer.errorResume.callCount, 1);
    t.deepEqual(observer.errorResume.calls, [[INPUT_ERROR]]);
    t.deepEqual(observer.errorResume.results, [['error', THROWN_ERROR]]);

    t.is(observer.complete.callCount, 0);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR]]);

    t.is(subscription.closed, false);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onComplete', (t) => {
    const INITIAL_VALUE = Math.random();
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = {
        next: tinyspy.spy(),
        errorResume: tinyspy.spy(),
        complete: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.complete(createCompletionOk());
    testTarget.complete(createCompletionOk());

    // assert
    t.is(observer.next.callCount, 1);
    t.deepEqual(observer.next.calls, [[INITIAL_VALUE]]);
    t.is(observer.errorResume.callCount, 0);
    t.is(observer.complete.callCount, 1);
    t.deepEqual(observer.complete.calls, [
        // @prettier-ignore
        [createCompletionOk()],
    ]);
    t.deepEqual(observer.complete.results, [['error', THROWN_ERROR]]);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR]]);

    t.is(subscription.closed, true);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onNext -> onError', (t) => {
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const THROWN_ERROR_ON_NEXT_CB = new Error(String(Math.random()));
    const THROWN_ERROR_ON_ERROR_CB = new Error(String(Math.random()));

    // setup
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = {
        next: tinyspy.spy((_val) => {
            throw THROWN_ERROR_ON_NEXT_CB;
        }),
        errorResume: tinyspy.spy((_val) => {
            throw THROWN_ERROR_ON_ERROR_CB;
        }),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });
    testTarget.next(SECOND_VALUE);

    // assert
    t.is(observer.next.callCount, 2, '.next should be called once');
    t.deepEqual(observer.next.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
        [SECOND_VALUE],
    ]);
    t.deepEqual(observer.next.results, [
        ['error', THROWN_ERROR_ON_NEXT_CB],
        ['error', THROWN_ERROR_ON_NEXT_CB],
    ]);

    t.is(observer.errorResume.callCount, 2);
    t.deepEqual(observer.errorResume.calls, [
        // @prettier-ignore
        [THROWN_ERROR_ON_NEXT_CB],
        [THROWN_ERROR_ON_NEXT_CB],
    ]);
    t.deepEqual(observer.errorResume.results, [
        ['error', THROWN_ERROR_ON_ERROR_CB],
        ['error', THROWN_ERROR_ON_ERROR_CB],
    ]);

    t.is(observer.complete.callCount, 0, '.complete should not be called');

    t.is(spiedReportError.callCount, 2);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR_ON_ERROR_CB], [THROWN_ERROR_ON_ERROR_CB]]);

    t.is(subscription.closed, false);

    t.is(testTarget.isCompleted, false);
});
