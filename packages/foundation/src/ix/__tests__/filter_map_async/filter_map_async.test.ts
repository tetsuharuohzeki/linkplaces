/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import * as Ix from '../../mod.js';

test('check the normal behavior', async (t) => {
    const source = (async function* () {
        for await (const val of [1, 2, 3]) {
            yield val;
        }
    })();
    const mapped = Ix.filterMapAsync<number, number>(source, async (val) => {
        if (val % 2 === 0) {
            return null;
        }
        return val;
    });
    const actual = await Ix.toArrayAsync(mapped);

    t.deepEqual(actual, [1, 3]);
});
