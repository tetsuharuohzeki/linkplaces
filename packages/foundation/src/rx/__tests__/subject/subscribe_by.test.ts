/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest, describe, it, beforeEach } from 'vitest';
import { Subject } from '../../mod.js';

test('onSubscribe should be invoked by calling `.subscribeBy()`', () => {
    // arrange
    const testTarget = new Subject<number>();
    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    });

    // assert
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
    expect(subscription.closed).toBe(false);

    // teardown
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);
});

describe('.subscribeBy() should propagate the passed value to the child', () => {
    it('onNext()', () => {
        // setup
        const TEST_INPUT = [1, 2, 3];
        const testTarget = new Subject<number>();
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        for (const i of TEST_INPUT) {
            testTarget.next(i);
        }

        // assertion
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [1],
            [2],
            [3],
        ]);

        // teardown
        subscription.unsubscribe();
        expect(subscription.closed).toBe(true);
    });

    it('onError', () => {
        // setup
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new Subject<number>();
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                testTarget.errorResume(i);
            } else {
                testTarget.next(i);
            }
        }

        // assertion
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [2],
            [4],
        ]);
        expect(onError.mock.calls).toStrictEqual([
            // @prettier-ignore
            [1],
            [3],
        ]);

        // teardown
        subscription.unsubscribe();
        expect(subscription.closed).toBe(true);
    });

    it('onComplete', () => {
        // setup
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new Subject<number>();
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        testTarget.complete(createOk<void>(undefined));
        testTarget.complete(createOk<void>(undefined));
        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                testTarget.errorResume(i);
            } else {
                testTarget.next(i);
            }
        }

        // assertions
        expect(onComplete.mock.calls).toStrictEqual([
            // @prettier-ignore
            [createOk<void>(undefined)],
        ]);
        expect(onNext).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(0);

        // teardown
        subscription.unsubscribe();
        expect(subscription.closed).toBe(true);
    });
});

describe('Graceful shutdown subscriptions if the child observer throw the error', () => {
    beforeEach(() => {
        globalThis.reportError = vitest.fn();
    });

    it('onNext()', () => {
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new Subject<number>();
        const onNext = vitest.fn((_val) => {
            throw THROWN_ERROR;
        });
        const onError = vitest.fn();
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        testTarget.next(1);

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledWith(1);
        expect(onNext).toThrowError(THROWN_ERROR);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(THROWN_ERROR);

        expect(onComplete).toHaveBeenCalledTimes(0);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onError', () => {
        const INPUT_ERROR = new Error(String(Math.random()));
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new Subject<number>();
        const onNext = vitest.fn();
        const onError = vitest.fn((_val) => {
            throw THROWN_ERROR;
        });
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        testTarget.errorResume(INPUT_ERROR);

        // assert
        expect(onNext).toHaveBeenCalledTimes(0);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(INPUT_ERROR);
        expect(onError).toThrowError(THROWN_ERROR);

        expect(onComplete).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onComplete', () => {
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new Subject<number>();
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onComplete = vitest.fn((_val) => {
            throw THROWN_ERROR;
        });

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        testTarget.complete(createOk<void>(undefined));
        testTarget.complete(createOk<void>(undefined));

        // assert
        expect(onNext).toHaveBeenCalledTimes(0);

        expect(onError).toHaveBeenCalledTimes(0);

        expect(onComplete).toHaveBeenCalledTimes(1);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        expect(testTarget.isCompleted).toBe(true);
        expect(subscription.closed).toBe(true);

        // teardown
        subscription.unsubscribe();
    });

    it('onNext -> onError', () => {
        const THROWN_ERROR_ON_NEXT_CB = new Error(String(Math.random()));
        const THROWN_ERROR_ON_ERROR_CB = new Error(String(Math.random()));

        // setup
        const testTarget = new Subject<number>();
        const onNext = vitest.fn((_val) => {
            throw THROWN_ERROR_ON_NEXT_CB;
        });
        const onError = vitest.fn((_val) => {
            throw THROWN_ERROR_ON_ERROR_CB;
        });
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });
        testTarget.next(1);

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledWith(1);
        expect(onNext).toThrowError(THROWN_ERROR_ON_NEXT_CB);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(THROWN_ERROR_ON_NEXT_CB);
        expect(onError).toThrowError(THROWN_ERROR_ON_ERROR_CB);

        expect(onComplete).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR_ON_ERROR_CB);

        expect(testTarget.isCompleted).toBe(false);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });
});

test("the returned subscription's .unsubscribe() should propagate to the source", () => {
    expect.assertions(4);

    // arrange
    const testTarget = new Subject<void>();
    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    });
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    // assert
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});

test('the destination should not work after calling .unsubscribe() returned by .subscribeBy()', () => {
    expect.assertions(5);

    // arrange
    const testTarget = new Subject<void>();
    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    });
    expect(subscription.closed).toBe(false);
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    testTarget.next();
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assert
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});
