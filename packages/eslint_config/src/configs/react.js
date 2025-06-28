import eslintReact from "@eslint-react/eslint-plugin";
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';

import reactPresets from './vendor/react.cjs';
import tsReactPresets from './vendor/typescript_react.cjs';

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
const reactPluginConfigs = [
    reactESLintPlugin.configs.flat.recommended,
    reactESLintPlugin.configs.flat['jsx-runtime'],
    eslintReact.configs["recommended-typescript"],
    {
        plugins: {
            react: reactESLintPlugin,
        },
        settings: {
            react: {
                version: '19.1',
            },
        },
        rules: {
            ...reactPresets.rules,
            ...tsReactPresets.rules,

            // We would like to use syntax to swap to other libs easily.
            'react/jsx-fragments': ['warn', 'syntax'],
            // We would like to remove useless fragment.
            'react/jsx-no-useless-fragment': [
                'warn',
                {
                    // We allow for typescript's typecheck
                    allowExpressions: true,
                },
            ],

            'react/no-arrow-function-lifecycle': 'error',
        },
    },
];

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
const hooksPluginConfigs = [
    reactHooksESLintPlugin.configs.recommended,
    {
        rules: {
            'react-hooks/react-compiler': 'error',
        },
    },
];

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
export const configs = Object.freeze([
    // @prettier-ignore
    ...reactPluginConfigs,
    ...hooksPluginConfigs,
]);
