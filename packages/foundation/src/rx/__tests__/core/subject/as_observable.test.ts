import test from 'ava';
import { Observable, Subject } from '../../../mod.js';

test('.asObservable() should be derived instance', (t) => {
    const sub = new Subject();
    const actual = sub.asObservable();
    t.assert(actual instanceof Observable);
});

test('.asObservable() should be return the same value', (t) => {
    const sub = new Subject();
    const actual1 = sub.asObservable();
    const actual2 = sub.asObservable();
    t.is(actual1, actual2);
});
