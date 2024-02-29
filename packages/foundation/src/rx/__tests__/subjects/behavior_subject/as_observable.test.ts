import test from 'ava';
import { Observable, BehaviorSubject } from '../../../mod.js';

test('.asObservable() should be derived instance', (t) => {
    const sub = new BehaviorSubject(1);
    const actual = sub.asObservable();
    t.assert(actual instanceof Observable);
});
