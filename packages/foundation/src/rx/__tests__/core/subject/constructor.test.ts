import test from 'ava';
import { Subject } from '../../../mod.js';

test('constructor', (t) => {
    t.notThrows(() => {
        const actual = new Subject();
        return actual;
    });
});
