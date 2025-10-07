import importPlugin from 'eslint-plugin-import-x';

import { possibleErrors, helpfulWarnings, moduleSystems, styleguide } from './vendor/import.js';

const plugins = {
    import: importPlugin,
};

const settings = {
    'import-x/resolver': {
        node: {
            extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        },
    },

    // By default, this option does not include `.jsx` extension.
    'import-x/extensions': ['.mjs', '.js', '.jsx'],
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

const projectSpecificRules = Object.freeze({});

const rulesForCJS = Object.freeze({
    ...possibleErrors,
    ...helpfulWarnings,
    ...moduleSystems,
    ...styleguide,
    ...projectSpecificRules,
});

const rulesForESM = Object.freeze({
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
        ...rulesForCJS,
    },
    settings,
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const configForJavaScriptESM = Object.freeze({
    plugins,
    rules: {
        ...rulesForESM,
    },
    settings: {
        ...settings,
        // We need this to avoid the error:
        //  ```
        //  Parse errors in imported module '......': parserPath or languageOptions.parser is required! (undefined:undefined)
        //  ```
        'import-x/parsers': {
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
        ...rulesForESM,
        // This can be detected by typescript compiler.
        'import/named': 'off',
        'import/namespace': 'off',
    },
    settings: {
        ...settings,
        'import-x/parsers': {
            '@typescript-eslint/parser': [
                ...['.ts', '.tsx', '.mts', '.cts'],
                // We need to specify this due to avoid `Parse errors in imported module '....': parserPath is required!`
                ...['.js', '.mjs', '.cjs'],
            ],
        },
    },
});
