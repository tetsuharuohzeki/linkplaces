import globals from 'globals';

const ecmaVersion = 2022;

export const languageOptionsForModule = Object.freeze({
    ecmaVersion,
    sourceType: 'module',
    globals: {
        ...globals.nodeBuiltin,
    },
});

export const languageOptionsForCommonJS = Object.freeze({
    ecmaVersion,
    sourceType: 'commonjs',
    globals: {
        ...globals.node,
        ...globals.commonjs,
    },
});

export const languageOptionsForTesting = Object.freeze({
    ecmaVersion,
    sourceType: 'module',
    globals: {
        ...globals.nodeBuiltin,
        ...globals.browser,
    },
});
