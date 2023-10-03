import importPlugin from 'eslint-plugin-import';

import { config as prettierRules } from './prettier.js';
import corePresets from './vendor/core.cjs';
import importPresets from './vendor/import.cjs';

const builtinRules = Object.freeze({
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
    'class-methods-use-this': 'warn',

    // This prevents the pattern that is error prone.
    'no-constant-binary-expression': 'error',

    // Allow to cast to boolean with `!!bar`. This is common idiom.
    'no-extra-boolean-cast': 'off',

    // We should not use it by the reason described in https://eslint.org/docs/latest/rules/no-object-constructor
    'no-object-constructor': 'warn',

    // This detects unused field easily.
    'no-unused-private-class-members': 'warn',

    // We use custom config to make the behavior similar to TypeScript's unused var checker.
    'no-unused-vars': [
        // Not make an error for debugging.
        'warn',
        {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_', // Sort with TypeScript compiler's builtin linter.
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_', // Allow `catch (_e) {...}`
        },
    ],

    // This prevents the error at the running time.
    'valid-typeof': ['error', { requireStringLiterals: true }],
});

const projectRules = Object.freeze({
    'no-magic-numbers': 'off',

    'no-restricted-imports': [
        'error',
        {
            paths: [
                'option-t/cjs/ClassicOption',
                'option-t/cjs/ClassicResult',
                'option-t/esm/ClassicOption',
                'option-t/esm/ClassicResult',
                'option-t/ClassicOption',
                'option-t/ClassicResult',
            ],
        },
    ],

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

export const rulesForESModule = Object.freeze({
    'import/extensions': [
        'error',
        'always',
        {
            ignorePackages: true,
        },
    ],
});

export const config = Object.freeze({
    plugins: {
        import: importPlugin,
    },
    rules: {
        ...corePresets.rules,
        ...builtinRules,
        ...importPresets.rules,
        ...prettierRules.rules,
        ...projectRules,
        ...rulesForESModule,
    },
    settings: {
        ...importPresets.settings,
        'import/parsers': {
            '@typescript-eslint/parser': [
                ...['.ts', '.tsx', '.mts', '.cts'],
                // We need to specify this due to avoid `Parse errors in imported module './prettier.js': parserPath is required!`
                ...['.js', '.mjs', '.cjs'],
            ],
        },
    },
});
