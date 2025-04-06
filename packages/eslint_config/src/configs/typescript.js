import assert from 'node:assert/strict';

import tsESLintPlugin from '@typescript-eslint/eslint-plugin';
import tsESLintParser from '@typescript-eslint/parser';
import globals from 'globals';

import * as tsNamingConvention from './typescript/naming-convention.js';
import * as tsNoRestrictedSyntax from './typescript/no-restricted-syntax.js';
import tsPresets from './vendor/typescript.cjs';

const tsESLintPluginConfigs = tsESLintPlugin.configs;
assert(tsESLintPluginConfigs);
const tsESLintPluginConfigRecommended = tsESLintPluginConfigs.recommended.rules;
assert(tsESLintPluginConfigRecommended);
// const tsESLintPluginConfigRecommendedTypeCheck = tsESLintPluginConfigs['recommended-type-checked'].rules;

const tsGlobals = Object.freeze({});

const rules = Object.freeze({
    // See https://eslint.org/docs/latest/rules/no-undef
    'no-undef': 'off',

    // See https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how/
    '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
            prefer: 'type-imports',
        },
    ],
    // Prevent to leave the import that is only imports a type.
    // It causes an unpredictable side effect caused by chaning the order of import for whole of the module graph.
    '@typescript-eslint/no-import-type-side-effects': 'error',

    // Sugget more simplified code.
    '@typescript-eslint/no-unnecessary-template-expression': 'warn',

    // We would like to allow to create a new derived interface for future extension.
    '@typescript-eslint/no-empty-object-type': 'off',

    '@typescript-eslint/no-restricted-types': 'error',

    // We would like to allow an arbitary function type
    '@typescript-eslint/no-unsafe-function-type': 'warn',

    '@typescript-eslint/no-wrapper-object-types': 'error',

    // Should throw only Error or derived classes.
    'no-throw-literal': 'off',
    '@typescript-eslint/only-throw-error': 'error',

    // This TypeScript syntax is useful to reduce declarations of class properties.
    // However, we feel this syntax has these negative points:
    //
    //  * This is not a part of ECMA262 standards.
    //  * This makes the ordering of initializing members unclear.
    //
    // By these things, we enable this rule as defensive choice.
    '@typescript-eslint/parameter-properties': [
        'warn',
        {
            prefer: 'class-property',
        },
    ],

    ...tsNamingConvention.rules,
});

/*
const rulesRequiringTypeInfo = Object.freeze({
    // This are unsafe pattern that we would like to ban.
    '@typescript-eslint/no-unsafe-argument': 'warn',
    // FIXME: This causes a false positive and I seem that cannot handles generics correctly......
    //'@typescript-eslint/no-unsafe-assignment': 'warn',
    // FIXME: This causes a false positive.
    //'@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-declaration-merging': 'warn',
    // FIXME:
    // @typescript-eslint/no-unsafe-enum-comparison': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
});
*/

const projectSpecificRules = Object.freeze({
    // FIXME: Re-enable for the future.
    '@typescript-eslint/member-ordering': 'off',

    ...tsNoRestrictedSyntax.rules,
});

export function createlanguageOptionsForTypeScript(baseDir) {
    return Object.freeze({
        sourceType: 'module',
        globals: {
            ...globals.builtin,
            ...globals.browser,
            ...globals.webextensions,
            ...tsGlobals,
        },
        parser: tsESLintParser,
        parserOptions: {
            tsconfigRootDir: baseDir,
            projectService: {
                allowDefaultProject: ['./*.js'],
                defaultProject: './tsconfig.json',
            },
            ecmaFeatures: {
                jsx: true,
            },
        },
    });
}

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const config = Object.freeze({
    plugins: {
        '@typescript-eslint': tsESLintPlugin,
    },
    rules: {
        ...tsESLintPluginConfigRecommended,
        // Disable due to lint errors that only is reproduced in CI job.
        //...tsESLintPluginConfigRecommendedTypeCheck,
        ...tsPresets.rules,

        ...rules,
        // They are useful but it's too noisy in monorepo.
        // I disable them once.
        //...rulesRequiringTypeInfo,
        ...projectSpecificRules,
    },
});
