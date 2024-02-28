import { expect, test } from 'vitest';
import { Subject } from '../../mod.js';

test('constructor', () => {
    expect(() => {
        const actual = new Subject();
        return actual;
    }).not.toThrow();
});
