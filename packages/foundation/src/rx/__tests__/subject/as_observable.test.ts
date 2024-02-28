import { expect, test } from 'vitest';
import { Observable, Subject } from '../../mod.js';

test('.asObservable() should be derived instance', () => {
    const sub = new Subject();
    const actual = sub.asObservable();
    expect(actual).instanceOf(Observable);
});
