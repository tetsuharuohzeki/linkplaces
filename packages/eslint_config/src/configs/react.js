import eslintReact from '@eslint-react/eslint-plugin';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';

import reactPresets from './vendor/react.cjs';

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
const reactPluginConfigs = [
    reactESLintPlugin.configs.flat.recommended,
    reactESLintPlugin.configs.flat['jsx-runtime'],
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
        },
    },
];

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
const modernReactPluginConfigs = [
    eslintReact.configs['recommended-typescript'],
    {
        rules: {
            // Enforce to specify html's boolean type attribute.
            '@eslint-react/avoid-shorthand-boolean': 'error',

            // We don't have to use a react class component excluding some situations
            // that you need to implement react error boundary with `getDerivedStateFromError()`.
            // See:
            //  - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
            //  - https://react.dev/reference/react/Component#static-getderivedstatefromerror
            //  - https://eslint-react.xyz/docs/rules/no-class-component
            '@eslint-react/no-class-component': 'error',
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
    ...modernReactPluginConfigs,
    ...hooksPluginConfigs,
]);
