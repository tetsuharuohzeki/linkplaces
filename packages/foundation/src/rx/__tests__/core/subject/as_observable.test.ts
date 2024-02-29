import test from 'ava';
import { Observable, Subject } from '../../../mod.js';

test('.asObservable() should be derived instance', (t) => {
    const sub = new Subject();
    const actual = sub.asObservable();
    t.assert(actual instanceof Observable);
});
