/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { isUndefined } from 'option-t/Undefinable';
import * as Ix from '../../mod.js';
import { toAsyncIterable } from '../__helpers__/to_async_iterable.js';

test('check the normal behavior', async (t) => {
    // arrange
    const source = toAsyncIterable([1, 2, 3]);
    const mapped = Ix.filterMapAsyncWithComparator<number, number, undefined>(
        source,
        async (val) => {
            if (val % 2 === 0) {
                return undefined;
            }
            return val;
        },
        isUndefined
    );
    // act
    const actual = await Ix.toArrayAsync(mapped);

    t.deepEqual(actual, [1, 3]);
});

test('allow to consume the same instance multiple times', async (t) => {
    // arrange
    const source = toAsyncIterable([1, 2, 3]);
    const mapped = Ix.filterMapAsyncWithComparator<number, number, undefined>(
        source,
        async (val) => {
            if (val % 2 === 0) {
                return undefined;
            }
            return val;
        },
        isUndefined
    );
    // act
    const actualConsumedFirst = await Ix.toArrayAsync(mapped);
    const actualConsumedTwice = await Ix.toArrayAsync(mapped);

    // assert
    t.deepEqual(actualConsumedFirst, [1, 3]);
    t.deepEqual(actualConsumedTwice, [1, 3]);
});
