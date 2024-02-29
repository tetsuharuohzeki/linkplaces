/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest, describe, it, beforeEach, type Mock } from 'vitest';
import type { CompletionResult } from '../../../core/subscriber.js';
import { InternalSubscriber } from '../../../core/subscriber_impl.js';
import { BehaviorSubject, type Observer } from '../../../mod.js';

class TestSubscriber<T> extends InternalSubscriber<T> {
    override onNext(_value: T): void {}
    override onErrorResume(_error: unknown): void {}
    override onCompleted(_result: CompletionResult): void {}
}

test('onSubscribe should be invoked by calling `.subscribe()`', () => {
    // arrange
    const INITIAL_VALUE = Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);

    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();
    const observer: Observer<number> = {
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    };

    // act
    const subscription = testTarget.subscribe(observer);

    // assert
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
    expect(subscription.closed).toBe(false);

    // teardown
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);
});

describe('.subscribe() should propagate the passed value to the child', () => {
    it('onNext()', () => {
        // setup
        const INITIAL_VALUE = Math.random();
        const TEST_INPUT = [1, 2, 3];
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');

        // act
        const unsubscriber = testTarget.subscribe(observer);
        for (const i of TEST_INPUT) {
            testTarget.next(i);
        }

        // assertion
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
            [1],
            [2],
            [3],
        ]);

        // teardown
        unsubscriber.unsubscribe();
        expect(unsubscriber.closed).toBe(true);
    });

    it('onError', () => {
        // setup
        const INITIAL_VALUE = Math.random();
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');
        const onError = vitest.spyOn(observer, 'onErrorResume');

        // act
        const unsubscriber = testTarget.subscribe(observer);
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
            [INITIAL_VALUE],
            [2],
            [4],
        ]);
        expect(onError.mock.calls).toStrictEqual([
            // @prettier-ignore
            [1],
            [3],
        ]);

        // teardown
        unsubscriber.unsubscribe();
        expect(unsubscriber.closed).toBe(true);
    });

    it('onComplete', () => {
        // setup
        const INITIAL_VALUE = Math.random();
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');
        const onError = vitest.spyOn(observer, 'onErrorResume');
        const onCompleted = vitest.spyOn(observer, 'onCompleted');

        // act
        const unsubscriber = testTarget.subscribe(observer);
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
        expect(onCompleted.mock.calls).toStrictEqual([
            // @prettier-ignore
            [createOk<void>(undefined)],
        ]);
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
        ]);
        expect(onError).toHaveBeenCalledTimes(0);

        // teardown
        unsubscriber.unsubscribe();
        expect(unsubscriber.closed).toBe(true);
    });
});

describe('Graceful shutdown subscriptions if the child observer throw the error', () => {
    let mockReporter: Mock<[unknown], void>;
    beforeEach(() => {
        mockReporter = vitest.fn();
        globalThis.reportError = mockReporter;
    });

    it('onNext()', () => {
        const INITIAL_VALUE = Math.random();
        const SECOND_VALUE = 1 + Math.random();
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const onNext = vitest.fn(() => {
            throw THROWN_ERROR;
        });
        const onError = vitest.fn();
        const onComplete = vitest.fn();
        const observer: Observer<number> = {
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.next(SECOND_VALUE);

        // assert
        expect(onNext).toHaveBeenCalledTimes(2);
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
            [SECOND_VALUE],
        ]);
        expect(onNext.mock.results).toStrictEqual([
            {
                type: 'throw',
                value: THROWN_ERROR,
            },
            {
                type: 'throw',
                value: THROWN_ERROR,
            },
        ]);

        expect(onError).toHaveBeenCalledTimes(2);
        expect(onError.mock.calls).toStrictEqual([
            // @prettier-ignore
            [THROWN_ERROR],
            [THROWN_ERROR],
        ]);

        expect(onComplete).toHaveBeenCalledTimes(0);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onError', () => {
        const INITIAL_VALUE = Math.random();
        const INPUT_ERROR = new Error(String(Math.random()));
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const onNext = vitest.fn();
        const onError = vitest.fn(() => {
            throw THROWN_ERROR;
        });
        const onComplete = vitest.fn();
        const observer: Observer<number> = {
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.errorResume(INPUT_ERROR);

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
        ]);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INPUT_ERROR],
        ]);
        expect(onError.mock.results).toStrictEqual([
            {
                type: 'throw',
                value: THROWN_ERROR,
            },
        ]);

        expect(onComplete).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onComplete', () => {
        const INITIAL_VALUE = Math.random();
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onComplete = vitest.fn(() => {
            throw THROWN_ERROR;
        });
        const observer: Observer<number> = {
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.complete(createOk<void>(undefined));
        testTarget.complete(createOk<void>(undefined));

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
        ]);

        expect(onError).toHaveBeenCalledTimes(0);

        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete.mock.calls).toStrictEqual([
            // @prettier-ignore
            [createOk<void>(undefined)],
        ]);
        expect(onComplete.mock.results).toStrictEqual([
            {
                type: 'throw',
                value: THROWN_ERROR,
            },
        ]);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        expect(testTarget.isCompleted).toBe(true);
        expect(subscription.closed).toBe(true);

        // teardown
        subscription.unsubscribe();
    });

    it('onNext -> onError', () => {
        const INITIAL_VALUE = Math.random();
        const SECOND_VALUE = 1 + Math.random();
        const THROWN_ERROR_ON_NEXT_CB = new Error(String(Math.random()));
        const THROWN_ERROR_ON_ERROR_CB = new Error(String(Math.random()));

        // setup
        const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
        const onNext = vitest.fn((_val) => {
            throw THROWN_ERROR_ON_NEXT_CB;
        });
        const onError = vitest.fn((_val) => {
            throw THROWN_ERROR_ON_ERROR_CB;
        });
        const onComplete = vitest.fn();
        const observer: Observer<number> = {
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.next(SECOND_VALUE);

        // assert
        expect(onNext).toHaveBeenCalledTimes(2);
        expect(onNext.mock.calls).toStrictEqual([
            // @prettier-ignore
            [INITIAL_VALUE],
            [SECOND_VALUE],
        ]);
        expect(onNext.mock.results).toStrictEqual([
            {
                type: 'throw',
                value: THROWN_ERROR_ON_NEXT_CB,
            },
            {
                type: 'throw',
                value: THROWN_ERROR_ON_NEXT_CB,
            },
        ]);

        expect(onError).toHaveBeenCalledTimes(2);
        expect(onError.mock.calls).toStrictEqual([
            // @prettier-ignore
            [THROWN_ERROR_ON_NEXT_CB],
            [THROWN_ERROR_ON_NEXT_CB],
        ]);
        expect(onError.mock.results).toStrictEqual([
            {
                type: 'throw',
                value: THROWN_ERROR_ON_ERROR_CB,
            },
            {
                type: 'throw',
                value: THROWN_ERROR_ON_ERROR_CB,
            },
        ]);

        expect(onComplete).toHaveBeenCalledTimes(0);

        expect(mockReporter).toHaveBeenCalledTimes(2);
        expect(mockReporter.mock.calls).toStrictEqual([
            // @prettier-ignore
            [THROWN_ERROR_ON_ERROR_CB],
            [THROWN_ERROR_ON_ERROR_CB],
        ]);

        expect(testTarget.isCompleted).toBe(false);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });
});

test("the returned subscription's .unsubscribe() should propagate to the source", () => {
    expect.assertions(5);

    // arrange
    const INITIAL_VALUE = Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);

    // act
    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();
    const observer: Observer<number> = {
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    };
    const subscription = testTarget.subscribe(observer);
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    // assert
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', () => {
    expect.assertions(6);

    // arrange
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);

    // act
    const onNext = vitest.fn();
    const onError = vitest.fn();
    const onComplete = vitest.fn();
    const observer: Observer<number> = {
        next: onNext,
        errorResume: onError,
        complete: onComplete,
    };
    const subscription = testTarget.subscribe(observer);
    expect(subscription.closed).toBe(false);
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    testTarget.next(SECOND_VALUE);
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assert
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', () => {
    expect.assertions(7);

    // setup
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    expect(observer.isActive()).toBe(true);
    const subscription = testTarget.subscribe(observer);
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);

    testTarget.next(SECOND_VALUE);
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assertion
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext.mock.calls).toStrictEqual([
        // @prettier-ignore
        [INITIAL_VALUE],
    ]);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);

    // teardown
    expect(subscription.closed).toBe(true);
});

test('if the passed destination is closed', () => {
    expect.assertions(5);

    // setup
    const INITIAL_VALUE = Math.random();
    const SECOND_VALUE = 1 + Math.random();
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);
    const subscription = testTarget.subscribe(observer);

    testTarget.next(SECOND_VALUE);
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assertion
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);

    // teardown
    expect(subscription.closed).toBe(true);
});

test('prevent cycle myself', () => {
    const INITIAL_VALUE = Math.random();
    const target = new BehaviorSubject<number>(INITIAL_VALUE);

    expect(() => {
        target.subscribe(target);
    }).toThrowError(new Error('recursive subscription happens'));
});
