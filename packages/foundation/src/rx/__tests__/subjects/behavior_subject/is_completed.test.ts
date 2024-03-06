import test from 'ava';
import { createOk } from 'option-t/PlainResult';
import { BehaviorSubject } from '../../../mod.js';

test('set .isCompleted on calling .unsubscribe()', (t) => {
    const actual = new BehaviorSubject(0);
    actual.unsubscribe();

    t.is(actual.isCompleted, true);
});

test('set .isCompleted on calling .complete()', (t) => {
    const actual = new BehaviorSubject(0);

    {
        const result = createOk(undefined);
        actual.complete(result);
    }

    t.is(actual.isCompleted, true);
});
