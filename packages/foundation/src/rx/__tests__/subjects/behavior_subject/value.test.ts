import { expect, test } from 'vitest';
import { BehaviorSubject, Subject } from '../../../mod.js';

test('.value()', () => {
    const EXPECTED = Math.random();

    const actual = new BehaviorSubject(EXPECTED);
    expect(actual.value()).toBe(EXPECTED);
});

test('.value should be updated on calling next', () => {
    const actual = new BehaviorSubject(0);

    const EXPECTED = Math.random();
    actual.next(EXPECTED);

    expect(actual.value()).toBe(EXPECTED);
});

test('.value should be updated on emit through subscribe', () => {
    const emitter = new Subject();
    const target = new BehaviorSubject(0);
    emitter.subscribe(target);

    const EXPECTED = Math.random();
    emitter.next(EXPECTED);

    expect(target.value()).toBe(EXPECTED);
});
