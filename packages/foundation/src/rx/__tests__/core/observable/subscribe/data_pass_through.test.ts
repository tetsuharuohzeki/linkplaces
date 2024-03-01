/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as tinyspy from 'tinyspy';

import { createCompletionOk } from '../../../../mod.js';
import { TestObservable, TestSubscriber } from './__helpers__/mod.js';

test('.subscribe() should propagate the passed value to the child: onNext()', (t) => {
    // setup
    const TEST_INPUT = [1, 2, 3];
    const testTarget = new TestObservable<number>((destination) => {
        for (const i of TEST_INPUT) {
            destination.next(i);
        }
    });
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');

    // act
    const unsubscriber = testTarget.subscribe(observer);
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });

    // assert
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [1],
        [2],
        [3],
    ]);

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);
});

test('.subscribe() should propagate the passed value to the child: onError', (t) => {
    // setup
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new TestObservable<number>((destination) => {
        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                destination.error(i);
            } else {
                destination.next(i);
            }
        }
    });
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');

    // act
    const unsubscriber = testTarget.subscribe(observer);
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });

    // assert
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [2],
        [4],
    ]);
    t.deepEqual(onError.calls, [
        // @prettier-ignore
        [1],
        [3],
    ]);

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);
});

test('.subscribe() should propagate the passed value to the child: onCompleted', (t) => {
    // setup
    const TEST_INPUT = [1, 2, 3, 4];
    const testTarget = new TestObservable<number>((destination) => {
        destination.complete(createCompletionOk());
        destination.complete(createCompletionOk());

        for (const i of TEST_INPUT) {
            if (i % 2 !== 0) {
                destination.error(i);
            } else {
                destination.next(i);
            }
        }
    });
    const observer = new TestSubscriber<number>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    const unsubscriber = testTarget.subscribe(observer);
    t.teardown(() => {
        unsubscriber.unsubscribe();
    });

    // assert
    t.deepEqual(onCompleted.calls, [
        // @prettier-ignore
        [createCompletionOk()],
    ]);
    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);

    unsubscriber.unsubscribe();
    t.is(unsubscriber.closed, true);
});
