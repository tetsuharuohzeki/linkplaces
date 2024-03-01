import test from 'ava';
import { spy } from 'tinyspy';

import { Subject } from '../../../mod.js';

test('.next() should propagate the passed value to the child', (t) => {
    const target = new Subject<number>();
    const onNext = spy();
    target.subscribeBy({
        onNext: onNext,
    });

    const INPUT = Math.random();
    target.next(INPUT);
    t.is(onNext.callCount, 1);
    t.deepEqual(onNext.calls, [[INPUT]]);
});

test('.next() should propagate the passed value but not reentrant', (t) => {
    const target = new Subject<number>();
    const innerOnNext = spy();
    const outerOnNext = spy((_value) => {
        target.subscribeBy({
            onNext: innerOnNext,
        });
    });
    target.subscribeBy({
        onNext: outerOnNext,
    });

    const INPUT = Math.random();
    target.next(INPUT);
    t.is(outerOnNext.callCount, 1);
    t.deepEqual(outerOnNext.calls, [[INPUT]]);

    t.is(innerOnNext.callCount, 0);
});
