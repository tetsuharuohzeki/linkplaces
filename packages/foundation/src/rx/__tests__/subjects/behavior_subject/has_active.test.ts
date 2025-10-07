import test from 'ava';
import { BehaviorSubject } from '../../../mod.js';

test('set .hasActive on calling .unsubscribe()', (t) => {
    const actual = new BehaviorSubject(0);
    actual.unsubscribe();

    t.is(actual.hasActive, false);
});

test('set .hasActive on calling .complete()', (t) => {
    const actual = new BehaviorSubject(0);

    {
        const result = null;
        actual.complete(result);
    }

    t.is(actual.hasActive, false);
});
