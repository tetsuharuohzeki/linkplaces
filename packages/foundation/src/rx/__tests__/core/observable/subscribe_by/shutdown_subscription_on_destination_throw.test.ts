import test from 'ava';
import * as tinyspy from 'tinyspy';

import { type Subscriber, createCompletionOk } from '../../../../mod.js';
import { TestObservable } from './__helpers__/mod.js';

const spiedReportError = tinyspy.spy();

test.before(() => {
    globalThis.reportError = spiedReportError;
});

test.beforeEach(() => {
    spiedReportError.reset();
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onNext()', (t) => {
    const ERR_MESSAGE = String(Math.random());
    const INPUT = 1 + Math.random();
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        passedSubscriber = destination;
        destination.next(INPUT);
    });
    const onNext = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INPUT]]);
    t.deepEqual(onNext.results, [['error', THROWN_ERROR]]);

    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[THROWN_ERROR]]);

    t.is(onCompleted.callCount, 0);
    t.is(subscription.closed, false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), true);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onError', (t) => {
    const INPUT_ERROR = new Error(String(Math.random()));
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        passedSubscriber = destination;
        destination.error(INPUT_ERROR);
    });
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 0);

    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[INPUT_ERROR]]);
    t.deepEqual(onError.results, [['error', THROWN_ERROR]]);

    t.is(onCompleted.callCount, 0);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR]]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), true);
    t.is(subscription.closed, false);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onCompleted', (t) => {
    const ERR_MESSAGE = String(Math.random());
    const THROWN_ERROR = new Error(ERR_MESSAGE);

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        passedSubscriber = destination;
        destination.complete(createCompletionOk());
        destination.complete(createCompletionOk());
    });
    const onNext = tinyspy.spy();
    const onError = tinyspy.spy();
    const onCompleted = tinyspy.spy(() => {
        throw THROWN_ERROR;
    });

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });

    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 1);

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR]]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), false);
    t.is(subscription.closed, true);
});

test.serial('Graceful shutdown subscriptions if the child observer throw the error: onNext -> onError', (t) => {
    const THROWN_ERROR_ON_NEXT_CB = new Error('next: ' + String(Math.random()));
    const THROWN_ERROR_ON_ERROR_CB = new Error('error: ' + String(Math.random()));

    // setup
    let passedSubscriber: Subscriber<number>;
    const testTarget = new TestObservable<number>((destination) => {
        passedSubscriber = destination;
        destination.next(1);
    });
    const onNext = tinyspy.spy(() => {
        throw THROWN_ERROR_ON_NEXT_CB;
    });
    const onError = tinyspy.spy(() => {
        throw THROWN_ERROR_ON_ERROR_CB;
    });
    const onCompleted = tinyspy.spy();

    // act
    const subscription = testTarget.subscribeBy({
        next: onNext,
        error: onError,
        complete: onCompleted,
    });
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onNext.callCount, 1, '.next should be called once');
    t.deepEqual(onNext.calls, [[1]]);
    t.deepEqual(onNext.results, [['error', THROWN_ERROR_ON_NEXT_CB]]);

    t.is(onError.callCount, 1);
    t.deepEqual(onError.calls, [[THROWN_ERROR_ON_NEXT_CB]]);
    t.deepEqual(onError.results, [['error', THROWN_ERROR_ON_ERROR_CB]]);

    t.is(onCompleted.callCount, 0, '.complete should not be called');

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR_ON_ERROR_CB]]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), true);
    t.is(subscription.closed, false);
});
