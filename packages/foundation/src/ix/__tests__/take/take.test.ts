/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = [1, 2, 3, 4, 5];
    const took = Ix.take(source, 3);
    const actual = Array.from(took);

    t.deepEqual(actual, [1, 2, 3]);
});

test('count must be greater than zero: if count=0', (t) => {
    const source = [1, 2, 3, 4, 5];
    t.throws(
        () => {
            Ix.take(source, 0);
        },
        {
            instanceOf: RangeError,
            message: `cound must be >= 1. but the actual is 0`,
        }
    );
});

test('count must be greater than zero: if count=-1', (t) => {
    const source = [1, 2, 3, 4, 5];
    t.throws(
        () => {
            Ix.take(source, -1);
        },
        {
            instanceOf: RangeError,
            message: `cound must be >= 1. but the actual is -1`,
        }
    );
});

test('count is greater than source', (t) => {
    const source = [1, 2, 3, 4, 5];
    const took = Ix.take(source, 100000);
    const actual = Array.from(took);

    t.deepEqual(actual, [1, 2, 3, 4, 5]);
});

test('allow to consume the same instance multiple times', (t) => {
    // arrange
    const source = [1, 2, 3, 4, 5];
    const took = Ix.take(source, 3);
    // act
    const actualConsumedFirst = Array.from(took);
    const actualConsumedTwice = Array.from(took);

    // assert
    t.deepEqual(actualConsumedFirst, [1, 2, 3]);
    t.deepEqual(actualConsumedTwice, [1, 2, 3]);
});
