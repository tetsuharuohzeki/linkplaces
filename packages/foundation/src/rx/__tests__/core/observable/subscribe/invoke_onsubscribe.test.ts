import test from 'ava';
import * as tinyspy from 'tinyspy';

import type { Observer } from '../../../../mod.js';
import { TestObservable } from '../../../__helpers__/mod.js';

test('onSubscribe should be invoked by calling `.subscribe()`', (t) => {
    // arrange
    const onSubscribeFn = tinyspy.spy();
    const testTarget = new TestObservable<number>(onSubscribeFn);
    t.is(onSubscribeFn.callCount, 0);

    // act
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;
    const subscription = testTarget.subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(onSubscribeFn.callCount, 1);
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);
    t.is(subscription.closed, false);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);
});
