/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = [1, 2, 3, 4, 5];
    const took = Ix.skip(source, 3);
    const actual = Array.from(took);

    t.deepEqual(actual, [4, 5]);
});

test('count must be greater than zero: if count=0', (t) => {
    const source = [1, 2, 3, 4, 5];
    t.throws(
        () => {
            Ix.skip(source, 0);
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
            Ix.skip(source, -1);
        },
        {
            instanceOf: RangeError,
            message: `cound must be >= 1. but the actual is -1`,
        }
    );
});

test('count is greater than source', (t) => {
    const source = [1, 2, 3, 4, 5];
    const took = Ix.skip(source, 100000);
    const actual = Array.from(took);

    t.deepEqual(actual, []);
});

test('allow to consume the same instance multiple times', (t) => {
    // arrange
    const source = [1, 2, 3, 4, 5];
    const took = Ix.skip(source, 3);
    // act
    const actualConsumedFirst = Array.from(took);
    const actualConsumedTwice = Array.from(took);

    // assert
    t.deepEqual(actualConsumedFirst, [4, 5]);
    t.deepEqual(actualConsumedTwice, [4, 5]);
});
