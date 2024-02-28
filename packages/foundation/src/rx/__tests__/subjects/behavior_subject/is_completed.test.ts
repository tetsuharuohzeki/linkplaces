import { createOk } from 'option-t/esm/PlainResult';
import { expect, test } from 'vitest';
import { BehaviorSubject } from '../../../mod.js';

test('set .isCompleted on calling .unsubscribe()', () => {
    const actual = new BehaviorSubject(0);
    actual.unsubscribe();

    expect(actual.isCompleted).toBe(true);
});

test('set .isCompleted on calling .complete()', () => {
    const actual = new BehaviorSubject(0);

    {
        const result = createOk(undefined);
        actual.complete(result);
    }

    expect(actual.isCompleted).toBe(true);
});
