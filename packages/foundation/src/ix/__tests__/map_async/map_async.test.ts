/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';
import { toAsyncIterable } from '../__helpers__/to_async_iterable.js';

test('check the normal behavior', async (t) => {
    // arrange
    const source = toAsyncIterable([1, 2, 3]);
    const mapped = Ix.mapAsync(source, async (val) => {
        return val * val;
    });
    // act
    const actual = await Ix.toArrayAsync(mapped);

    t.deepEqual(actual, [1, 4, 9]);
});

test('allow to consume the same instance multiple times', async (t) => {
    // arrange
    const source = toAsyncIterable([1, 2, 3]);
    const mapped = Ix.mapAsync(source, async (val) => {
        return val * val;
    });
    // act
    const actualConsumedFirst = await Ix.toArrayAsync(mapped);
    const actualConsumedTwice = await Ix.toArrayAsync(mapped);

    // assert
    t.deepEqual(actualConsumedFirst, [1, 4, 9]);
    t.deepEqual(actualConsumedTwice, [1, 4, 9]);
});
