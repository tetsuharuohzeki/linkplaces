import { expect, test } from 'vitest';
import { BehaviorSubject } from '../../../mod.js';

test('constructor', () => {
    expect(() => {
        const actual = new BehaviorSubject(0);
        return actual;
    }).not.toThrow();
});
