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


const tsGlobals = Object.freeze({
    // see https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    JSX: 'readonly',
});

const rules = Object.freeze({
    // FIXME: Re-enable for the future.
    '@typescript-eslint/member-ordering': 'off',

    'react/no-arrow-function-lifecycle': 'error',
});

export function createlanguageOptionsForTypeScript(baseDir) {
    const TSCONFIG_PATH = path.resolve(baseDir, './tsconfig.eslint.json');

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
            project: TSCONFIG_PATH,
            ecmaFeatures: {
                jsx: true,
            },
        },
    });
}

export const config = Object.freeze({
    plugins: {
        '@typescript-eslint': tsESLintPlugin,
        react: reactESLintPlugin,
        'react-hooks': reactHooksESLintPlugin,
    },
    rules: {
        ...reactHooksESLintPlugin.configs.recommended.rules,
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
    },

    settings: {
        react: {
            version: '18.2',
        },
    },
});
