/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Nullable } from 'option-t/Nullable';

let original: Nullable<typeof Math.random> = null;

function createFakeMathRandom() {
    let seed = 49734321;
    return function MockMathRandom() {
        /* eslint-disable no-bitwise */

        // Robert Jenkins' 32 bit integer hash function.
        seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
        seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
        seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
        seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
        return (seed & 0xfffffff) / 0x10000000;

        /* eslint-enable */
    };
}

export function replaceMathRandomWithFake() {
    if (original !== null) {
        throw new TypeError('Math.random() has been mocked. You may call this twice');
    }

    original = Math.random;
    globalThis.Math.random = createFakeMathRandom();
}

export function revetMathRandomToOriginal() {
    if (original === null) {
        throw new TypeError('Math.random() has NOT been mocked. You may call this twice');
    }

    globalThis.Math.random = original;
    original = null;
}
