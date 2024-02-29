import test from 'ava';
import { BehaviorSubject } from '../../../mod.js';

test('constructor', (t) => {
    t.notThrows(() => {
        const actual = new BehaviorSubject(0);
        return actual;
    });
});
