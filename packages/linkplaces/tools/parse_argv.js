import * as assert from 'node:assert';
import * as Undefinedable from 'option-t/esm/Undefinable';

function isFlagKey(str) {
    return str.startsWith('--');
}

class SimpleArgvParser {
    #argv;
    #currentIndex;

    constructor(argv) {
        this.#argv = argv;
        this.#currentIndex = 0;
    }

    #get(idx) {
        const item = this.#argv[idx];
        const result = Undefinedable.unwrapOr(item, null);
        return result;
    }

    current() {
        const idx = this.#currentIndex;
        const item = this.#get(idx);
        return item;
    }

    lookahead() {
        const idx = this.#currentIndex + 1;
        const item = this.#get(idx);
        return item;
    }

    forwardCurrentIndexTo(num) {
        assert.ok(typeof num === 'number');
        this.#currentIndex = this.#currentIndex + num;
    }

    next() {
        const current = this.current();
        if (current === null) {
            return {
                done: true,
                value: undefined,
            };
        }

        assert.ok(isFlagKey(current), `current should always starts with \`--\` but the actual is ${current}`);

        const next = this.lookahead();
        if (next === null || isFlagKey(next)) {
            this.forwardCurrentIndexTo(1);
            return {
                done: false,
                value: [current, undefined],
            };
        }

        this.forwardCurrentIndexTo(2);
        return {
            done: false,
            value: [current, next],
        };
    }

    [Symbol.iterator]() {
        return this;
    }
}

export function parseCliOptions(processArgv) {
    assert.ok(Array.isArray(processArgv), 'argv must be an array');
    const candidate = processArgv.slice(2);
    const argSet = new Set(candidate);

    const parser = new SimpleArgvParser(candidate);
    const argsMap = new Map(parser);
    console.dir(argsMap);

    const isVerbose = argsMap.has('--verbose');
    const isDebug = argsMap.has('--debug');

    const baseDir = argsMap.get('--basedir');
    if (!baseDir) {
        throw new Error('no baseDir');
    }

    const source = argsMap.get('--source');
    if (!source) {
        throw new Error('no source');
    }

    const destinationDir = argsMap.get('--destination');
    if (!destinationDir) {
        throw new Error('no destinationDir');
    }

    const result = Object.freeze({
        isVerbose,
        isDebug,
        baseDir,
        source,
        destinationDir,
    });
    return result;
}
