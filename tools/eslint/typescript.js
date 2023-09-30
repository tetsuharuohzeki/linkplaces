import * as path from 'node:path';

import tsESLintPlugin from '@typescript-eslint/eslint-plugin';
import tsESLintParser from '@typescript-eslint/parser';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { rulesForESModule } from './core.js';
import reactPresets from './vendor/react.cjs';
import tsPresets from './vendor/typescript.cjs';
import tsReactPresets from './vendor/typescript_react.cjs';

const tsGlobals = Object.freeze({});

const rules = Object.freeze({
    // FIXME: Re-enable for the future.
    '@typescript-eslint/member-ordering': 'off',

    'react/no-arrow-function-lifecycle': 'error',
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

const tsESLintPluginConfigs = tsESLintPlugin.configs;
const tsESLintPluginConfigRecommended = tsESLintPluginConfigs.recommended.rules;
// const tsESLintPluginConfigRecommendedTypeCheck = tsESLintPluginConfigs['recommended-type-checked'].rules;

export const config = Object.freeze({
    plugins: {
        '@typescript-eslint': tsESLintPlugin,
        react: reactESLintPlugin,
        'react-hooks': reactHooksESLintPlugin,
    },
    rules: {
        ...reactHooksESLintPlugin.configs.recommended.rules,
        ...tsESLintPluginConfigRecommended,
        // Disable due to lint errors that only is reproduced in CI job.
        //...tsESLintPluginConfigRecommendedTypeCheck,
        ...tsPresets.rules,
        ...reactPresets.rules,
        ...reactESLintPlugin.configs['jsx-runtime'].rules,
        ...tsReactPresets.rules,
        ...rules,

        ...rulesForESModule,

        // Use TypeScript's checking instead.
        'import/no-unresolved': 'off',

        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
            },
        ],
        '@typescript-eslint/no-import-type-side-effects': 'warn',

        // In JavaScript, it's hard to minify a property that is on prototype chain.
        // Typically, they appears as a pattern as class' instance method.
        // We cannot remove or mangle a code like `a.foo()` style code
        // without analysis for whole of programs including usages of reflection
        // or identifying what item is a part of public interface.
        //
        // This rule bans a class instance method
        // that does not touch any `this` to improve a possibility to minify a code.
        //
        // Additionally, after ES Module or CommonJS era (single module per single file),
        // excluding the case to improve an API ergonomics or requirement to implement an object interface,
        // we don't have to belong a function that does not touch `this` to a class as like as Java or C++.
        //
        // To get a chance to improve a code size performance,
        // it's better that we should export a standalone function directly
        // instead of a part of class if it does not affect an API ergonomics.
        'class-methods-use-this': 'off',
        '@typescript-eslint/class-methods-use-this': [
            'warn',
            {
                // We would like to allow override the base method on super class.
                ignoreOverrideMethods: true,
                // We would like to allow to implement an empty method as a part of the interface.
                ignoreClassesThatImplementAnInterface: true,
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
    },

    settings: {
        react: {
            version: '18.2',
        },
    },
});
