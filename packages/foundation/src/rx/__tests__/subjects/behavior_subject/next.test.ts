/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { spy } from 'tinyspy';
import { BehaviorSubject } from '../../../mod.js';

test('.next() should propagate the passed value to the child', (t) => {
    const INITIAL_INPUT = 0;
    const SECOND_INPUT = 1;
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const onNext = spy();

    // act
    const sub = target.subscribeBy({
        onNext: onNext,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });
    target.next(SECOND_INPUT);

    t.is(onNext.callCount, 2);
    t.deepEqual(onNext.calls, [
        // @prettier-ignore
        [INITIAL_INPUT],
        [SECOND_INPUT],
    ]);
});

test('.next() should propagate the passed value even if in reentrant', (t) => {
    // arrange
    const INITIAL_INPUT = 0;
    const SECOND_INPUT = 1;
    const target = new BehaviorSubject<number>(INITIAL_INPUT);
    const innerOnNext = spy((_val) => {});
    const outerOnNext = spy((value) => {
        if (value === INITIAL_INPUT) {
            return;
        }

        target.subscribeBy({
            onNext: innerOnNext,
        });
    });

    // act
    const sub = target.subscribeBy({
        onNext: outerOnNext,
    });
    t.teardown(() => {
        sub.unsubscribe();
    });
    target.next(SECOND_INPUT);

    // assert
    t.is(outerOnNext.callCount, 2);
    t.deepEqual(outerOnNext.calls, [
        // @prettier-ignore
        [INITIAL_INPUT],
        [SECOND_INPUT],
    ]);

    t.is(innerOnNext.callCount, 1);
    t.deepEqual(innerOnNext.calls, [
        // @prettier-ignore
        [SECOND_INPUT],
    ]);
});
