import test from 'ava';
import * as tinyspy from 'tinyspy';

import { Subject, type Observer } from '../../../../mod.js';

test('onSubscribe should be invoked by calling `.subscribe()`', (t) => {
    // arrange
    const testTarget = new Subject<number>();

    // act
    const observer = {
        next: tinyspy.spy(),
        error: tinyspy.spy(),
        complete: tinyspy.spy(),
    } satisfies Observer<number>;
    const subscription = testTarget.asObservable().subscribe(observer);
    t.teardown(() => {
        subscription.unsubscribe();
    });

    // assert
    t.is(observer.next.callCount, 0);
    t.is(observer.error.callCount, 0);
    t.is(observer.complete.callCount, 0);
    t.is(subscription.closed, false);

    // teardown
    subscription.unsubscribe();
    t.true(subscription.closed);

    t.is(testTarget.hasActive, true, 'testTarget.hasActive');
});
