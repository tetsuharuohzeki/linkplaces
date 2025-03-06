import test from 'ava';

import { Subject, } from '../../../mod.js';

test('set .isCompleted on calling .unsubscribe()', (t) => {
    const actual = new Subject();
    actual.unsubscribe();

    t.is(actual.isCompleted, true);
});

test('set .isCompleted on calling .complete()', (t) => {
    const actual = new Subject();

    {
        const result = null;
        actual.complete(result);
    }

    t.is(actual.isCompleted, true);
});
