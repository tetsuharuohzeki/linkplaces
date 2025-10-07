import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Subscriber } from '../../../../mod.js';

import { TestSubscriber, TestObservable } from '../../../__helpers__/mod.js';

test('should throw if onSubscribeFn throw`', (t) => {
    // arrange
    const ERROER_MASSAGE = 'blah_blah_blah';
    const THROWN_ERROR = new Error(ERROER_MASSAGE);

    let passedSubscriber: Subscriber<void>;
    const onSubscribeFn = tinyspy.spy((destination) => {
        passedSubscriber = destination;
        throw THROWN_ERROR;
    });
    const testTarget = new TestObservable<void>(onSubscribeFn);
    t.is(onSubscribeFn.callCount, 0);

    const observer = new TestSubscriber<void>();
    const onNext = tinyspy.spyOn(observer, 'onNext');
    const onError = tinyspy.spyOn(observer, 'onError');
    const onCompleted = tinyspy.spyOn(observer, 'onCompleted');

    // act
    t.throws(() => testTarget.subscribe(observer), {
        message: ERROER_MASSAGE,
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(passedSubscriber!.isActive(), false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.next();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.error(new Error());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    passedSubscriber!.complete(null);

    // assert
    t.is(onSubscribeFn.callCount, 1);
    t.deepEqual(onSubscribeFn.results, [['error', THROWN_ERROR]]);

    t.is(observer.isActive(), false);

    t.is(onNext.callCount, 0);
    t.is(onError.callCount, 0);
    t.is(onCompleted.callCount, 0);
});
