/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = [1, 2, 3];
    const mapped = Ix.filterMap(source, (val) => {
        if (val % 2 === 0) {
            return null;
        }
        return val;
    });
    const actual = Array.from(mapped);

    t.deepEqual(actual, [1, 3]);
});
