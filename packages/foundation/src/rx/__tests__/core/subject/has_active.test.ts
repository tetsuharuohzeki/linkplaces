import test from 'ava';

import { Subject, } from '../../../mod.js';

test('set .hasActive on calling .unsubscribe()', (t) => {
    const actual = new Subject();
    actual.unsubscribe();

    t.is(actual.hasActive, false);
});

test('set .hasActive on calling .complete()', (t) => {
    const actual = new Subject();

    {
        const result = null;
        actual.complete(result);
    }

    t.is(actual.hasActive, false);
});
