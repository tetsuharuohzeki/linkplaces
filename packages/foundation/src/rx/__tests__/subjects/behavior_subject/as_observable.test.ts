import { expect, test } from 'vitest';
import { Observable, BehaviorSubject } from '../../../mod.js';

test('.asObservable() should be derived instance', () => {
    const sub = new BehaviorSubject(1);
    const actual = sub.asObservable();
    expect(actual).instanceOf(Observable);
});
