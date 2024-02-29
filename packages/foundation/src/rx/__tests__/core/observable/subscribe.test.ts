/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createOk } from 'option-t/esm/PlainResult';
import { expect, test, vitest, describe, it, beforeEach } from 'vitest';
import type { CompletionResult, Subscriber } from '../../../core/subscriber.js';
import { InternalSubscriber } from '../../../core/subscriber_impl.js';
import { Observable, type OnSubscribeFn, type Observer } from '../../../mod.js';

class TestObservable<T> extends Observable<T> {
    constructor(onSubscribe: OnSubscribeFn<T>) {
        super(onSubscribe);
    }
}

class TestSubscriber<T> extends InternalSubscriber<T> {
    override onNext(_value: T): void {}
    override onErrorResume(_error: unknown): void {}
    override onCompleted(_result: CompletionResult): void {}
}

test('onSubscribe should be invoked by calling `.subscribe()`', () => {
    // arrange
    const onSubscribeFn = vitest.fn();
    const testTarget = new TestObservable<number>(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledTimes(0);

    // act
    const observer: Observer<number> = {
        next: vitest.fn(),
        errorResume: vitest.fn(),
        complete: vitest.fn(),
    };
    const subscription = testTarget.subscribe(observer);

    // assert
    expect(onSubscribeFn).toHaveBeenCalledTimes(1);
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
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

    const observer = new TestSubscriber<void>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onErrorResume = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    expect(() => testTarget.subscribe(observer)).toThrowError(ERROER_MASSAGE);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(passedSubscriber!.isActive()).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.errorResume(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createOk<void>(undefined));

    // assert
    expect(onSubscribeFn).toHaveBeenCalledTimes(1);
    expect(onSubscribeFn).toThrowError(ERROER_MASSAGE);

    expect(observer.isActive()).toBe(false);

    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onErrorResume).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);
});

describe('.subscribe() should propagate the passed value to the child', () => {
    it('onNext()', () => {
        // setup
        const TEST_INPUT = [1, 2, 3];
        const testTarget = new TestObservable<number>((destination) => {
            for (const i of TEST_INPUT) {
                destination.next(i);
            }
        });
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');

        // act
        const unsubscriber = testTarget.subscribe(observer);
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
        });
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');
        const onError = vitest.spyOn(observer, 'onErrorResume');

        // act
        const unsubscriber = testTarget.subscribe(observer);
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
        });
        const observer = new TestSubscriber<number>();
        const onNext = vitest.spyOn(observer, 'onNext');
        const onError = vitest.spyOn(observer, 'onErrorResume');
        const onCompleted = vitest.spyOn(observer, 'onCompleted');

        // act
        const unsubscriber = testTarget.subscribe(observer);
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
        });
        const observer: Observer<number> = {
            next: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
            errorResume: vitest.fn(),
            complete: vitest.fn(),
        };

        // act
        const subscription = testTarget.subscribe(observer);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.next).toHaveBeenCalledWith(1);
        expect(observer.next).toThrowError(THROWN_ERROR);

        expect(observer.errorResume).toHaveBeenCalledTimes(1);
        expect(observer.errorResume).toHaveBeenCalledWith(THROWN_ERROR);

        expect(observer.complete).toHaveBeenCalledTimes(0);
        expect(subscription.closed).toBe(false);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isActive()).toBe(true);

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
        });
        const observer: Observer<number> = {
            next: vitest.fn(),
            errorResume: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
            complete: vitest.fn(),
        };

        // act
        const subscription = testTarget.subscribe(observer);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(0);

        expect(observer.errorResume).toHaveBeenCalledTimes(1);
        expect(observer.errorResume).toHaveBeenCalledWith(INPUT_ERROR);
        expect(observer.errorResume).toThrowError(THROWN_ERROR);

        expect(observer.complete).toHaveBeenCalledTimes(0);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isActive()).toBe(true);
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
        });
        const observer: Observer<number> = {
            next: vitest.fn(),
            errorResume: vitest.fn(),
            complete: vitest.fn((_val) => {
                throw THROWN_ERROR;
            }),
        };

        // act
        const subscription = testTarget.subscribe(observer);

        // assert
        expect(observer.next).toHaveBeenCalledTimes(0);

        expect(observer.errorResume).toHaveBeenCalledTimes(0);

        expect(observer.complete).toHaveBeenCalledTimes(1);

        expect(globalThis.reportError).toHaveBeenCalledTimes(1);
        expect(globalThis.reportError).toHaveBeenLastCalledWith(THROWN_ERROR);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isActive()).toBe(false);
        expect(subscription.closed).toBe(true);

        // teardown
        subscription.unsubscribe();
    });

    it('onNext -> onError', () => {
        const THROWN_ERROR_ON_NEXT_CB = new Error(String(Math.random()));
        const THROWN_ERROR_ON_ERROR_CB = new Error(String(Math.random()));

        // setup
        let passedSubscriber: Subscriber<number>;
        const testTarget = new TestObservable<number>((destination) => {
            passedSubscriber = destination;
            destination.next(1);
        });
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

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isActive()).toBe(true);
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
        expect(passedSubscriber!.isActive()).toBe(false);
    });
    const testTarget = new TestObservable<void>((destination) => {
        destination.addTeardown(onUnsubscribe);
        expect(destination.isActive()).toBe(true);
        passedSubscriber = destination;
    });

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
    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
});

test('the destination should not work after calling .unsubscribe() returned by .subscribe()', () => {
    expect.assertions(7);

    // arrange
    let passedSubscriber: Subscriber<void>;
    const onUnsubscribe = vitest.fn(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(passedSubscriber!.isActive()).toBe(true);
    });
    const testTarget = new TestObservable<void>((destination) => {
        destination.addTeardown(onUnsubscribe);
        expect(destination.isActive()).toBe(true);
        passedSubscriber = destination;
    });

    // act
    const observer: Observer<void> = {
        next: vitest.fn(),
        errorResume: vitest.fn(),
        complete: vitest.fn(),
    };
    const subscription = testTarget.subscribe(observer);
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
    expect(observer.next).toHaveBeenCalledTimes(0);
    expect(observer.errorResume).toHaveBeenCalledTimes(0);
    expect(observer.complete).toHaveBeenCalledTimes(0);
});

test('if the passed destination calls its unsubscribe() after start subscribing, event should not propagete to it', () => {
    expect.assertions(7);

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        expect(destination.isActive()).toBe(true);
        passedSubscriber = destination;
    });
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    expect(observer.isActive()).toBe(true);
    const subscription = testTarget.subscribe(observer);
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.errorResume(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(createOk<void>(undefined));

    // assertion
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);

    // teardown
    expect(subscription.closed).toBe(true);
});

test('if the passed destination is closed', () => {
    expect.assertions(6);

    // setup
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new TestObservable<number>((destination) => {
        expect(destination.isActive()).toBe(false);

        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                destination.errorResume(i);
            } else {
                destination.next(i);
            }
        }
    });
    const observer = new TestSubscriber<number>();
    const onNext = vitest.spyOn(observer, 'onNext');
    const onError = vitest.spyOn(observer, 'onErrorResume');
    const onCompleted = vitest.spyOn(observer, 'onCompleted');

    // act
    observer.unsubscribe();
    expect(observer.isActive()).toBe(false);
    const subscription = testTarget.subscribe(observer);

    // assertion
    expect(onNext).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(onCompleted).toHaveBeenCalledTimes(0);

    // teardown
    expect(subscription.closed).toBe(true);
});
