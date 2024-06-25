import importPlugin from 'eslint-plugin-import';

import { possibleErrors, helpfulWarnings, moduleSystems, styleguide } from './vendor/import.cjs';

const plugins = {
    import: importPlugin,
};

const settings = {
    'import/resolver': {
        node: {
            extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        },
    },

    // By default, this option does not include `.jsx` extension.
    'import/extensions': ['.mjs', '.js', '.jsx'],
};

const rulesForESModule = Object.freeze({
    'import/extensions': [
        'error',
        'always',
        {
            ignorePackages: true,
        },
    ],
});

const projectSpecificRules = Object.freeze({
    'import/no-unresolved': [
        'error',
        {
            ignore: [
                // We disable this rule until https://github.com/import-js/eslint-plugin-import/issues/1810 will be resolved.
                'ava',
                '^option-t/.*',
                '^@typescript-eslint/.*',
            ],
        },
    ],

    // These are crash with ESLint v9
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-amd': 'off',
    'import/no-mutable-exports': 'off',
    'import/namespace': 'off',
    'import/no-deprecated': 'off',
});

const rules = Object.freeze({
    ...possibleErrors,
    ...helpfulWarnings,
    ...moduleSystems,
    ...styleguide,
    ...rulesForESModule,
    ...projectSpecificRules,
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const configForJavaScriptCJS = Object.freeze({
    plugins,
    rules: {
        ...rules,
    },
    settings,
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const configForJavaScriptESM = Object.freeze({
    plugins,
    rules: {
        ...rules,
    },
    settings: {
        ...settings,
        // We need this to avoid the error:
        //  ```
        //  Parse errors in imported module '......': parserPath or languageOptions.parser is required! (undefined:undefined)
        //  ```
        'import/parsers': {
            '@typescript-eslint/parser': [...['.js', '.mjs', '.cjs']],
        },
    },
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const configForTypeScript = Object.freeze({
    plugins,
    rules: {
        ...rules,

        // Use TypeScript's checking instead.
        'import/no-unresolved': 'off',
    },
    settings: {
        ...settings,
        'import/parsers': {
            '@typescript-eslint/parser': [
                ...['.ts', '.tsx', '.mts', '.cts'],
                // We need to specify this due to avoid `Parse errors in imported module '....': parserPath is required!`
                ...['.js', '.mjs', '.cjs'],
            ],
        },
    },
});
