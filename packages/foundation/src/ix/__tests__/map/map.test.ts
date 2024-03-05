/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = [1, 2, 3];
    const mapped = Ix.map(source, (val) => {
        return val * val;
    });
    const actual = Array.from(mapped);

    t.deepEqual(actual, [1, 4, 9]);
});

test('allow to consume the same instance multiple times', (t) => {
    // arrange
    const source = [1, 2, 3];
    const mapped = Ix.map(source, (val) => {
        return val * val;
    });
    // act
    const actualConsumedFirst = Array.from(mapped);
    const actualConsumedTwice = Array.from(mapped);

    // assert
    t.deepEqual(actualConsumedFirst, [1, 4, 9]);
    t.deepEqual(actualConsumedTwice, [1, 4, 9]);
});
