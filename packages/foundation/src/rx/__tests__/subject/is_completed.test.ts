import { createOk } from 'option-t/esm/PlainResult';
import { expect, test } from 'vitest';
import { Subject } from '../../mod.js';

test('set .isCompleted on calling .unsubscribe()', () => {
    const actual = new Subject();
    actual.unsubscribe();

    expect(actual.isCompleted).toBe(true);
});

test('set .isCompleted on calling .complete()', () => {
    const actual = new Subject();

    {
        const result = createOk(undefined);
        actual.complete(result);
    }

    expect(actual.isCompleted).toBe(true);
});
