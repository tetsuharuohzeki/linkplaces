/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { spyOn } from 'tinyspy';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Ix from '../mod.js';
import { InfiniteIterator } from './__helpers__/infinite_iterable.js';

const INPUT_A = [1, 2, 3];
const INPUT_B = ['a', 'b', 'c'];
const INPUT_C = ['壱', '弍', '参'];

test('all inputs have same length', (t) => {
    // act
    const zipped = Ix.zip(INPUT_A, INPUT_B, INPUT_C);
    const actual: Array<[number, string, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        [1, 'a', '壱'],
        [2, 'b', '弍'],
        [3, 'c', '参'],
    ]);
});

test('all inputs are empty', (t) => {
    // act
    const zipped = Ix.zip([], [], []);
    const actual = Array.from(zipped);

    // assert
    t.is(actual.length, 0);
    t.deepEqual(actual, []);
});

test('end by shortest input: 1st is shorter', (t) => {
    // arrange
    const SHORTER_INPUT = [1, 2];
    t.true(SHORTER_INPUT.length < INPUT_A.length);

    // act
    const zipped = Ix.zip(SHORTER_INPUT, INPUT_B, INPUT_C);
    const actual: Array<[number, string, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        [1, 'a', '壱'],
        [2, 'b', '弍'],
    ]);
});

test('end by shortest input: 2nd is shorter', (t) => {
    // arrange
    const SHORTER_INPUT = ['a', 'b'];
    t.true(SHORTER_INPUT.length < INPUT_B.length);

    // act
    const zipped = Ix.zip(INPUT_A, SHORTER_INPUT, INPUT_C);
    const actual: Array<[number, string, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        [1, 'a', '壱'],
        [2, 'b', '弍'],
    ]);
});

test('end by shortest input: 3rd is shorter', (t) => {
    // arrange
    const SHORTER_INPUT = ['壱', '弍'];
    t.true(SHORTER_INPUT.length < INPUT_C.length);

    // act
    const zipped = Ix.zip(INPUT_A, INPUT_B, SHORTER_INPUT);
    const actual: Array<[number, string, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        [1, 'a', '壱'],
        [2, 'b', '弍'],
    ]);
});

test('end by shortest input: call iterator.return() properly: 1st is shortest', (t) => {
    // arrange
    const SHORTER_INPUT = [1, 2];
    const INFINITE_ITARATOR_2 = new InfiniteIterator('2nd');
    const INFINITE_ITARATOR_3 = new InfiniteIterator('3rd');

    const inputSpied2 = spyOn(INFINITE_ITARATOR_2, 'return');
    const inputSpied3 = spyOn(INFINITE_ITARATOR_3, 'return');

    // act
    const zipped = Ix.zip(SHORTER_INPUT, INFINITE_ITARATOR_2, INFINITE_ITARATOR_3);
    const actual: Array<[number, string, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        [1, '2nd', '3rd'],
        [2, '2nd', '3rd'],
    ]);
    t.is(inputSpied2.callCount, 1);
    t.is(inputSpied3.callCount, 1);
});

test('end by shortest input: call iterator.return() properly: 2nd is shortest', (t) => {
    // arrange
    const SHORTER_INPUT = [1, 2];
    const INFINITE_ITARATOR_1 = new InfiniteIterator('1st');
    const INFINITE_ITARATOR_3 = new InfiniteIterator('3rd');

    const inputSpied1 = spyOn(INFINITE_ITARATOR_1, 'return');
    const inputSpied3 = spyOn(INFINITE_ITARATOR_3, 'return');

    // act
    const zipped = Ix.zip(INFINITE_ITARATOR_1, SHORTER_INPUT, INFINITE_ITARATOR_3);
    const actual: Array<[string, number, string]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        ['1st', 1, '3rd'],
        ['1st', 2, '3rd'],
    ]);
    t.is(inputSpied1.callCount, 1);
    t.is(inputSpied3.callCount, 1);
});

test('end by shortest input: call iterator.return() properly: 3rd is shortest', (t) => {
    // arrange
    const SHORTER_INPUT = [1, 2];
    const INFINITE_ITARATOR_1 = new InfiniteIterator('1st');
    const INFINITE_ITARATOR_2 = new InfiniteIterator('2nd');

    const inputSpied1 = spyOn(INFINITE_ITARATOR_1, 'return');
    const inputSpied2 = spyOn(INFINITE_ITARATOR_2, 'return');

    // act
    const zipped = Ix.zip(INFINITE_ITARATOR_1, INFINITE_ITARATOR_2, SHORTER_INPUT);
    const actual: Array<[string, string, number]> = Array.from(zipped);

    // assert
    t.deepEqual(actual, [
        ['1st', '2nd', 1],
        ['1st', '2nd', 2],
    ]);
    t.is(inputSpied1.callCount, 1);
    t.is(inputSpied2.callCount, 1);
});
