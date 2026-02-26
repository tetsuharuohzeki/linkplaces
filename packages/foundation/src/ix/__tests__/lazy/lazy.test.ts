/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', (t) => {
    const source = Ix.lazy(function* () {
        for (let i = 1; i <= 3; ++i) {
            yield i;
        }
    });

    const actual1 = Ix.toArray(source);
    t.deepEqual(actual1, [1, 2, 3]);

    const actual2 = Ix.toArray(source);
    t.deepEqual(actual2, [1, 2, 3]);
});
