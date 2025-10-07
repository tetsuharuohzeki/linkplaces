/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { BehaviorSubject } from '../../../../mod.js';
import { TestSubscriber } from './__helpers__/mod.js';

test('.subscribe() should propagate the passed value to the child: onNext()', (t) => {
    // setup
    const INITIAL_VALUE = Math.random();
    const TEST_INPUT = [1, 2, 3];
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');

    // act
    const unsubscriber = testTarget.asObservable().subscribe(observer);
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });
    for (const i of TEST_INPUT) {
        testTarget.next(i);
    }

    // assert
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_VALUE],
        [1],
        [2],
        [3],
    ]);

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);

    t.is(testTarget.hasActive, false, 'testTarget.hasActive');
});

test('.subscribe() should propagate the passed value to the child: onError', (t) => {
    // setup
    const INITIAL_VALUE = Math.random();
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');

    // act
    const unsubscriber = testTarget.asObservable().subscribe(observer);
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });
    for (const i of TEST_INPUT) {
        if (i % 2 !== 0) {
            testTarget.error(i);
        } else {
            testTarget.next(i);
        }
    }

    // assert
    t.deepEqual(
        onNext.calls,
        [
            // @prettier-ignore
            [INITIAL_VALUE],
            [2],
            [4],
        ],
        'onNext input'
    );
    t.deepEqual(
        onError.calls,
        [
            // @prettier-ignore
            [1],
            [3],
        ],
        'onError input'
    );

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);

    t.is(testTarget.hasActive, false, 'testTarget.hasActive');
});

test('.subscribe() should propagate the passed value to the child: onCompleted', (t) => {
    // setup
    const INITIAL_VALUE = Math.random();
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new BehaviorSubject<number>(INITIAL_VALUE);
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    const unsubscriber = testTarget.asObservable().subscribe(observer);
    testTarget.complete(null);
    testTarget.complete(null);
    for (const i of TEST_INPUT) {
        if (i % 2 !== 0) {
            testTarget.error(i);
        } else {
            testTarget.next(i);
        }
    }
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });

    // assert
    t.deepEqual(onCompleted.calls, [
        // @prettier-ignore
        [null],
    ]);
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INITIAL_VALUE]]);
    t.is(onError.callCount, 0);

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);

    t.is(testTarget.hasActive, false, 'testTarget.hasActive');
});
