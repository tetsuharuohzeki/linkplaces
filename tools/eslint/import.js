import assert from 'node:assert/strict';
import importPlugin from 'eslint-plugin-import';

import importPresets from './vendor/import.cjs';

const importPresetsRules = importPresets.rules;
assert(importPresetsRules);
const importPresetsSettings = importPresets.settings;
assert(importPresetsSettings);

const plugins = {
    import: importPlugin,
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
});

const ruleset = Object.freeze({
    ...importPresetsRules,
    ...rulesForESModule,
    ...projectSpecificRules,
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const configForJavaScript = Object.freeze({
    plugins,
    rules: {
        ...ruleset,
    },
    settings: {
        ...importPresetsSettings,
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
        ...ruleset,

        // Use TypeScript's checking instead.
        'import/no-unresolved': 'off',
    },
    settings: {
        ...importPresetsSettings,
        'import/parsers': {
            '@typescript-eslint/parser': [
                ...['.ts', '.tsx', '.mts', '.cts'],
                // We need to specify this due to avoid `Parse errors in imported module '....': parserPath is required!`
                ...['.js', '.mjs', '.cjs'],
            ],
        },
    },
});
