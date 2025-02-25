import test from 'ava';
import { BehaviorSubject, Subject } from '../../../mod.js';

test('.value()', (t) => {
    const EXPECTED = Math.random();

    const actual = new BehaviorSubject(EXPECTED);
    t.is(actual.value(), EXPECTED);
});

test('.value should be updated on calling next', (t) => {
    const actual = new BehaviorSubject(0);

    const EXPECTED = Math.random();
    actual.next(EXPECTED);

    t.is(actual.value(), EXPECTED);
});

test('.value should be updated on emit through subscribe', (t) => {
    const emitter = new Subject();
    const target = new BehaviorSubject(0);
    emitter.asObservable().subscribe(target);

    const EXPECTED = Math.random();
    emitter.next(EXPECTED);

    t.is(target.value(), EXPECTED);
});
