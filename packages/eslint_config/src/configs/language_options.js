import globals from 'globals';

/**
 *  @typedef    {import('eslint').Linter.FlatConfig['languageOptions']} LanguageOptions
 */

const ecmaVersion = 2022;

/**
 *  @type   {LanguageOptions}
 */
export const languageOptionsForModule = Object.freeze({
    ecmaVersion,
    sourceType: 'module',
    globals: {
        ...globals.nodeBuiltin,
    },
});

/**
 *  @type   {LanguageOptions}
 */
export const languageOptionsForCommonJS = Object.freeze({
    ecmaVersion,
    sourceType: 'commonjs',
    globals: {
        ...globals.node,
        ...globals.commonjs,
    },
});

/**
 *  @type   {LanguageOptions}
 */
export const languageOptionsForTesting = Object.freeze({
    ecmaVersion,
    sourceType: 'module',
    globals: {
        ...globals.nodeBuiltin,
        ...globals.browser,
    },
});
