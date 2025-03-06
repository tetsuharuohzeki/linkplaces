import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Observer, Subscriber } from '../../../../mod.js';
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
    const observer = {
        next: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(observer.next.callCount, 1);
    t.deepEqual(observer.next.calls, [[INPUT]]);
    t.deepEqual(observer.next.results, [['error', THROWN_ERROR]]);

    t.is(observer.error.callCount, 1);
    t.deepEqual(observer.error.calls, [[THROWN_ERROR]]);

    t.is(observer.complete.callCount, 0);
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
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(observer.next.callCount, 0);

    t.is(observer.error.callCount, 1);
    t.deepEqual(observer.error.calls, [[INPUT_ERROR]]);
    t.deepEqual(observer.error.results, [['error', THROWN_ERROR]]);

    t.is(observer.complete.callCount, 0);

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
        destination.complete(null);
        destination.complete(null);
    });
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy((_val) => {
            throw THROWN_ERROR;
        }),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 1);

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
    const observer = {
        next: tinyspy.spy((_val) => {
            throw THROWN_ERROR_ON_NEXT_CB;
        }),
        error: tinyspy.spy((_val) => {
            throw THROWN_ERROR_ON_ERROR_CB;
        }),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;

    // act
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(observer.next.callCount, 1, '.next should be called once');
    t.deepEqual(observer.next.calls, [[1]]);
    t.deepEqual(observer.next.results, [['error', THROWN_ERROR_ON_NEXT_CB]]);

    t.is(observer.error.callCount, 1);
    t.deepEqual(observer.error.calls, [[THROWN_ERROR_ON_NEXT_CB]]);
    t.deepEqual(observer.error.results, [['error', THROWN_ERROR_ON_ERROR_CB]]);

    t.is(observer.complete.callCount, 0, '.complete should not be called');

    t.is(spiedReportError.callCount, 1);
    t.deepEqual(spiedReportError.calls, [[THROWN_ERROR_ON_ERROR_CB]]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), true);
    t.is(subscription.closed, false);
});
