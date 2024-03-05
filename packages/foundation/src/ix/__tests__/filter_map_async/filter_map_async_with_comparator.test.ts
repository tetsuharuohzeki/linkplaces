/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';
import { isUndefined } from 'option-t/esm/Undefinable';
import * as Ix from '../../mod.js';

test('check the normal behavior', async (t) => {
    const source = (async function* () {
        for await (const val of [1, 2, 3]) {
            yield val;
        }
    })();
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
    const actual = await Ix.toArrayAsync(mapped);

    t.deepEqual(actual, [1, 3]);
});
