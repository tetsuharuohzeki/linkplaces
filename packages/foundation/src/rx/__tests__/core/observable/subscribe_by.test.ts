/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest, describe, it, beforeEach } from 'vitest';
import { Observable, Subscription, type OnSubscribeFn, type Subscriber } from '../../../mod.js';

class TestObservable<T> extends Observable<T> {
    constructor(onSubscribe: OnSubscribeFn<T>) {
        super(onSubscribe);
    }
}

test('onSubscribe should be invoked by calling `.subscribeBy()`', () => {
    // arrange
    const onSubscribeFn = vitest.fn(() => new Subscription(null));
    const testTarget = new TestObservable<number>(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledTimes(0);
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
    expect(onSubscribeFn).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
    expect(subscription.closed).toBe(false);

    // teardown
    subscription.unsubscribe();
    expect(subscription.closed).toBe(true);
});

test('should throw if onSubscribeFn throw`', () => {
    // arrange
    const ERROER_MASSAGE = 'blah_blah_blah';
    let passedSubscriber: Subscriber<void>;
    const onSubscribeFn = vitest.fn((destination) => {
        passedSubscriber = destination;
        throw new Error(ERROER_MASSAGE);
    });
    const testTarget = new TestObservable<void>(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledTimes(0);

    const onNext = vitest.fn();
    const onErrorResume = vitest.fn();
    const onCompleted = vitest.fn();

    // act
    expect(() => {
        testTarget.subscribeBy({
            next: onNext,
            errorResume: onErrorResume,
            complete: onCompleted,
        });
    }).toThrowError(ERROER_MASSAGE);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(passedSubscriber!.isClosed()).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.errorResume(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createOk<void>(undefined));

    // assert
    expect(onSubscribeFn).toHaveBeenCalledTimes(1);
    expect(onSubscribeFn).toThrowError(ERROER_MASSAGE);

    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onErrorResume).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);
});

describe('.subscribeBy() should propagate the passed value to the child', () => {
    it('onNext()', () => {
        // setup
        const TEST_INPUT = [1, 2, 3];
        const testTarget = new TestObservable<number>((destination) => {
            for (const i of TEST_INPUT) {
                destination.next(i);
            }

            return new Subscription(null);
        });
        const onNext = vitest.fn();

        // act
        const unsubscriber = testTarget.subscribeBy({
            next: onNext,
        });
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
        const testTarget = new TestObservable<number>((destination) => {
            for (const i of TEST_INPUT) {
                if (i % 2 !== 0) {
                    destination.errorResume(i);
                } else {
                    destination.next(i);
                }
            }

            return new Subscription(null);
        });
        const onNext = vitest.fn();
        const onError = vitest.fn();

        // act
        const unsubscriber = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
        });
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
        const testTarget = new TestObservable<number>((destination) => {
            destination.complete(createOk<void>(undefined));
            destination.complete(createOk<void>(undefined));

            for (const i of TEST_INPUT) {
                if (i % 2 !== 0) {
                    destination.errorResume(i);
                } else {
                    destination.next(i);
                }
            }

            return new Subscription(null);
        });
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onCompleted = vitest.fn();

        // act
        const unsubscriber = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onCompleted,
        });
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
        let passedSubscriber: Subscriber<number>;
        const testTarget = new TestObservable<number>((destination) => {
            passedSubscriber = destination;
            destination.next(1);

            return new Subscription(null);
        });
        const onNext = vitest.fn(() => {
            throw THROWN_ERROR;
        });
        const onError = vitest.fn();
        const onCompleted = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onCompleted,
        });

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledWith(1);
        expect(onNext).toThrowError(THROWN_ERROR);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(THROWN_ERROR);

        expect(onCompleted).toHaveBeenCalledTimes(0);
        expect(subscription.closed).toBe(false);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onError', () => {
        const INPUT_ERROR = new Error(String(Math.random()));
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        let passedSubscriber: Subscriber<number>;
        const testTarget = new TestObservable<number>((destination) => {
            passedSubscriber = destination;
            destination.errorResume(INPUT_ERROR);

            return new Subscription(null);
        });
        const onNext = vitest.fn();
        const onError = vitest.fn(() => {
            throw THROWN_ERROR;
        });
        const onCompleted = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onCompleted,
        });

        // assert
        expect(onNext).toHaveBeenCalledTimes(0);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(INPUT_ERROR);
        expect(onError).toThrowError(THROWN_ERROR);

        expect(onCompleted).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(false);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });

    it('onComplete', () => {
        const ERR_MESSAGE = String(Math.random());
        const THROWN_ERROR = new Error(ERR_MESSAGE);

        // setup
        let passedSubscriber: Subscriber<number>;
        const testTarget = new TestObservable<number>((destination) => {
            passedSubscriber = destination;
            destination.complete(createOk<void>(undefined));
            destination.complete(createOk<void>(undefined));

            return new Subscription(null);
        });
        const onNext = vitest.fn();
        const onError = vitest.fn();
        const onCompleted = vitest.fn(() => {
            throw THROWN_ERROR;
        });

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onCompleted,
        });

        // assert
        expect(onNext).toHaveBeenCalledTimes(0);

        expect(onError).toHaveBeenCalledTimes(0);

        expect(onCompleted).toHaveBeenCalledTimes(1);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(true);
        expect(subscription.closed).toBe(true);

        // teardown
        subscription.unsubscribe();
    });

    it('onNext -> onError', () => {
        const INPUT = Math.random();

        const THROWN_ERROR_ON_NEXT_CB = new Error(String(Math.random()));
        const THROWN_ERROR_ON_ERROR_CB = new Error(String(Math.random()));

        // setup
        let passedSubscriber: Subscriber<number>;
        const testTarget = new TestObservable<number>((destination) => {
            passedSubscriber = destination;
            destination.next(INPUT);

            return new Subscription(null);
        });
        const onNext = vitest.fn(() => {
            throw THROWN_ERROR_ON_NEXT_CB;
        });
        const onError = vitest.fn(() => {
            throw THROWN_ERROR_ON_ERROR_CB;
        });
        const onComplete = vitest.fn();

        // act
        const subscription = testTarget.subscribeBy({
            next: onNext,
            errorResume: onError,
            complete: onComplete,
        });

        // assert
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledWith(INPUT);
        expect(onNext).toThrowError(THROWN_ERROR_ON_NEXT_CB);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(THROWN_ERROR_ON_NEXT_CB);
        expect(onError).toThrowError(THROWN_ERROR_ON_ERROR_CB);

        expect(onComplete).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR_ON_ERROR_CB);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(false);
        expect(subscription.closed).toBe(false);

        // teardown
        subscription.unsubscribe();
    });
});

test("the returned subscription's .unsubscribe() should propagate to the source", () => {
    expect.assertions(7);

    // arrange
    let passedSubscriber: Subscriber<void>;
    const onUnsubscribe = vitest.fn(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(true);
    });
    const testTarget = new TestObservable<void>((destination) => {
        expect(destination.isClosed()).toBe(false);
        passedSubscriber = destination;
        return new Subscription(onUnsubscribe);
    });
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
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});

test('the destination should not work after calling .unsubscribe() returned by .subscribeBy()', () => {
    expect.assertions(7);

    // arrange
    let passedSubscriber: Subscriber<void>;
    const onUnsubscribe = vitest.fn(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isClosed()).toBe(true);
    });
    const testTarget = new TestObservable<void>((destination) => {
        expect(destination.isClosed()).toBe(false);
        passedSubscriber = destination;
        return new Subscription(onUnsubscribe);
    });
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.errorResume(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createOk<void>(undefined));

    // assert
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
});
