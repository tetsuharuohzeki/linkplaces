/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { spyOn } from 'tinyspy';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Ix from '../mod.js';
import { InfiniteIterator } from './__helpers__/infinite_iterable.js';

const INPUT_A = [1, 2, 3];
const INPUT_B = ['a', 'b', 'c'];

test('all inputs have same length', (t) => {
    const zipped = Ix.zip(INPUT_A, INPUT_B);
    const actual: Array<[number, string]> = Array.from(zipped);
    t.deepEqual(actual, [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
    ]);
});

test('all inputs are empty', (t) => {
    const zipped = Ix.zip([], []);
    const actual = Array.from(zipped);

    t.is(actual.length, 0);
    t.deepEqual(actual, []);
});

test('end by shortest input: a is shorter', (t) => {
    const SHORTER_INPUT = [1, 2];
    t.true(SHORTER_INPUT.length < INPUT_A.length);

    const zipped = Ix.zip(SHORTER_INPUT, INPUT_B);
    const actual: Array<[number, string]> = Array.from(zipped);
    t.deepEqual(actual, [
        [1, 'a'],
        [2, 'b'],
    ]);
});

test('end by shortest input: b is shorter', (t) => {
    const SHORTER_INPUT = ['a', 'b'];
    t.true(SHORTER_INPUT.length < INPUT_B.length);

    const zipped = Ix.zip(INPUT_A, SHORTER_INPUT);
    const actual: Array<[number, string]> = Array.from(zipped);
    t.deepEqual(actual, [
        [1, 'a'],
        [2, 'b'],
    ]);
});

test('end by shortest input: call iterator.return() properly', (t) => {
    const SHORTER_INPUT = [1, 2];
    const INFINITE_ITARATOR = new InfiniteIterator('a');

    const infiniteIterable: Iterable<string> = {
        [Symbol.iterator]() {
            return INFINITE_ITARATOR;
        },
    };
    const infinitIteratorSpy = spyOn(INFINITE_ITARATOR, 'return');

    const zipped = Ix.zip(SHORTER_INPUT, infiniteIterable);
    const actual: Array<[number, string]> = Array.from(zipped);
    t.deepEqual(actual, [
        [1, 'a'],
        [2, 'a'],
    ]);
    t.is(infinitIteratorSpy.callCount, 1);
});
