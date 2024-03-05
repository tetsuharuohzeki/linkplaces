import test from 'ava';
import * as Ix from '../mod.js';

test('with single argument', (t) => {
    t.throws(
        () => {
            Ix.zip([]);
        },
        {
            instanceOf: RangeError,
            message: `sources contains only single elements. It's meaningless`,
        },
        'should recommend not to use if the input is single'
    );
});
