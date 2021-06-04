import test from 'ava';

import {
    replaceMathRandomWithFake,
    revetMathRandomToOriginal,
} from './_helper_math_random.mjs';

test.before(() => {
    replaceMathRandomWithFake();
});

test.after(() => {
    revetMathRandomToOriginal();
});

test('`Math.random()` should be deterministic value', (t) => {
    t.is(Math.random(), 0.9872818551957607);
});
