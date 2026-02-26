import { replaceMathRandomWithDeterministicFake, revetMathRandomToOriginal } from '@linkplaces/foundation/test_helper';
import test from 'ava';

test.before(() => {
    replaceMathRandomWithDeterministicFake();
});

test.after(() => {
    revetMathRandomToOriginal();
});

test('`Math.random()` should be deterministic value', (t) => {
    t.is(Math.random(), 0.9872818551957607);
});
