import assert from 'node:assert/strict';
import * as path from 'node:path';

import tsESLintPlugin from '@typescript-eslint/eslint-plugin';
import tsESLintParser from '@typescript-eslint/parser';
import globals from 'globals';

import tsPresets from './vendor/typescript.cjs';

const tsESLintPluginConfigs = tsESLintPlugin.configs;
assert(tsESLintPluginConfigs);
const tsESLintPluginConfigRecommended = tsESLintPluginConfigs.recommended.rules;
assert(tsESLintPluginConfigRecommended);
const tsESLintPluginConfigRecommendedTypeCheck = tsESLintPluginConfigs['recommended-type-checked'].rules;
assert(tsESLintPluginConfigRecommendedTypeCheck);

const tsGlobals = Object.freeze({});

const rules = Object.freeze({
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
    '@typescript-eslint/no-useless-template-literals': 'warn',

    // In JavaScript, after ES Module or CommonJS era (single module per single file),
    // excluding the case to improve an API ergonomics or requirement to implement an object interface,
    // we don't have to belong a function that does not touch `this` to a class unlike Java or C++.
    // We should not do such a thing.
    //
    // This rule bans a class instance method
    // that does not touch any `this` to improve a possibility to minify a code.
    //
    // Additionally, it's hard to minify a property that is on prototype chain.
    // Typically, they appears as a pattern as class' instance method.
    // We cannot remove or mangle a code like `a.foo()` style code
    // without analysis for whole of programs including usages of reflection
    // or identifying what item is a part of public interface.
    //
    // To get a chance to improve a code size performance and to simplify a code,
    // it's better that we should export a standalone function directly
    // instead of a part of class if it does not affect an API ergonomics.
    'class-methods-use-this': 'off',
    '@typescript-eslint/class-methods-use-this': [
        'warn',
        {
            // We would like to allow override the base method on super class.
            ignoreOverrideMethods: true,
            // We would like to allow to implement an empty method as a part of the interface.
            ignoreClassesThatImplementAnInterface: 'public-fields',
        },
    ],

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
});

const projectSpecificRules = Object.freeze({
    // FIXME: Re-enable for the future.
    '@typescript-eslint/member-ordering': 'off',
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
            project: [
                // @prettier-ignore
                path.resolve(baseDir, './tsconfig.eslint.json'),
                path.resolve(baseDir, './packages/*/tsconfig.json'),
            ],
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
        ...tsESLintPluginConfigRecommendedTypeCheck,
        ...tsPresets.rules,

        ...rules,
        ...projectSpecificRules,
    },
});
