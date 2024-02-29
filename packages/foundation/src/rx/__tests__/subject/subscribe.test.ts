/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest, describe, it, beforeEach } from 'vitest';
import type { CompletionResult } from '../../core/subscriber.js';
import { InternalSubscriber } from '../../core/subscriber_impl.js';
import { Subject, type Observer } from '../../mod.js';

class TestSubscriber<T> extends InternalSubscriber<T> {
    override onNext(_value: T): void {}
    override onErrorResume(_error: unknown): void {}
    override onCompleted(_result: CompletionResult): void {}
}

test('onSubscribe should be invoked by calling `.subscribe()`', () => {
    // arrange
    const testTarget = new Subject<number>();

    // act
    const observer: Observer<number> = {
        next: vitest.fn(),
        errorResume: vitest.fn(),
        complete: vitest.fn(),
    };
    const subscription = testTarget.subscribe(observer);

    // assert
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
    expect(subscription.closed).toBe(false);

    // teardown
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);
});

describe('.subscribe() should propagate the passed value to the child', () => {
    it('onNext()', () => {
        // setup
        const TEST_INPUT = [1, 2, 3];
        const testTarget = new Subject<number>();
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
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new Subject<number>();
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
        const TEST_INPUT = [1, 2, 3, 4];
        const testTarget = new Subject<number>();
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
        expect(onNext).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(0);

        // teardown
        unsubscriber.unsubscribe();
        expect(unsubscriber.closed).toBe(true);
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
        const observer: Observer<number> = {
            next: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
            errorResume: vitest.fn(),
            complete: vitest.fn(),
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.next(1);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.next).toHaveBeenCalledWith(1);
        expect(observer.next).toThrowError(THROWN_ERROR);

        expect(observer.errorResume).toHaveBeenCalledTimes(1);
        expect(observer.errorResume).toHaveBeenCalledWith(THROWN_ERROR);

        expect(observer.complete).toHaveBeenCalledTimes(0);
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
        const observer: Observer<number> = {
            next: vitest.fn(),
            errorResume: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
            complete: vitest.fn(),
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.errorResume(INPUT_ERROR);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(0);

        expect(observer.errorResume).toHaveBeenCalledTimes(1);
        expect(observer.errorResume).toHaveBeenCalledWith(INPUT_ERROR);
        expect(observer.errorResume).toThrowError(THROWN_ERROR);

        expect(observer.complete).toHaveBeenCalledTimes(0);

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
        const observer: Observer<number> = {
            next: vitest.fn(),
            errorResume: vitest.fn(),
            complete: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.complete(createOk<void>(undefined));
        testTarget.complete(createOk<void>(undefined));

        // assert
        expect(observer.next).toHaveBeenCalledTimes(0);

        expect(observer.errorResume).toHaveBeenCalledTimes(0);

        expect(observer.complete).toHaveBeenCalledTimes(1);

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
        const observer: Observer<number> = {
            next: vitest.fn((_val) => {
                throw THROWN_ERROR_ON_NEXT_CB;
            }),
            errorResume: vitest.fn((_val) => {
                throw THROWN_ERROR_ON_ERROR_CB;
            }),
            complete: vitest.fn(),
        };

        // act
        const subscription = testTarget.subscribe(observer);
        testTarget.next(1);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.next).toHaveBeenCalledWith(1);
        expect(observer.next).toThrowError(THROWN_ERROR_ON_NEXT_CB);

        expect(observer.errorResume).toHaveBeenCalledTimes(1);
        expect(observer.errorResume).toHaveBeenCalledWith(THROWN_ERROR_ON_NEXT_CB);
        expect(observer.errorResume).toThrowError(THROWN_ERROR_ON_ERROR_CB);

        expect(observer.complete).toHaveBeenCalledTimes(0);

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

    // act
    const observer: Observer<void> = {
        next: vitest.fn(),
        errorResume: vitest.fn(),
        complete: vitest.fn(),
    };
    const subscription = testTarget.subscribe(observer);
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    // assert
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
});

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', () => {
    expect.assertions(5);

    // arrange
    const testTarget = new Subject<void>();

    // act
    const observer: Observer<void> = {
        next: vitest.fn(),
        errorResume: vitest.fn(),
        complete: vitest.fn(),
    };
    const subscription = testTarget.subscribe(observer);
    expect(subscription.closed).toBe(false);
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);

    testTarget.next();
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assert
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
});

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', () => {
    expect.assertions(6);

    // setup
    const testTarget = new Subject<number>();
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    expect(observer.isActive()).toBe(true);
    const subscription = testTarget.subscribe(observer);
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);

    testTarget.next(1);
    testTarget.errorResume(new Error());
    testTarget.complete(createOk<void>(undefined));

    // assertion
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);

    // teardown
    expect(subscription.closed).toBe(true);
});

test('if the passed destination is closed', () => {
    expect.assertions(5);

    // setup
    const testTarget = new Subject<number>();
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);
    const subscription = testTarget.subscribe(observer);

    testTarget.next(1);
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
    const target = new Subject<number>();

    expect(() => {
        target.subscribe(target);
    }).toThrowError(new Error('recursive subscription happens'));
});
