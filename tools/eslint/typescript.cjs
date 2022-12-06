'use strict';

const path = require('node:path');

const sourceType = 'module';

const globals = Object.freeze({
    // see https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    JSX: 'readonly',
});

const rules = Object.freeze({
    // FIXME: Re-enable for the future.
    '@typescript-eslint/member-ordering': 'off',

    'react/no-arrow-function-lifecycle': 'error',
});

function createParserOptions(baseDir) {
    const TSCONFIG_PATH = path.resolve(baseDir, './tsconfig.eslint.json');
    return {
        sourceType,
        ecmaFeatures: {
            jsx: true,
        },
        project: TSCONFIG_PATH,
        extraFileExtensions: ['.cjs'],
    };
}

module.exports = Object.freeze({
    globals,
    rules,
    createParserOptions,
});
