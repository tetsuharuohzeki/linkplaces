/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { isUndefined, type Undefinable } from 'option-t/esm/Undefinable';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = [1, 2, 3];
    const mapped = Ix.filterMapWithComparator<number, Undefinable<number>, undefined>(
        source,
        (val) => {
            if (val % 2 === 0) {
                return undefined;
            }
            return val;
        },
        isUndefined
    );
    const actual = Array.from(mapped);

    t.deepEqual(actual, [1, 3]);
});
