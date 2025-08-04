import eslintReact from '@eslint-react/eslint-plugin';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
const reactPluginConfigs = [
    {
        plugins: {
            react: reactESLintPlugin,
        },
        rules: {
            'react/self-closing-comp': [
                2,
                {
                    component: true,
                    html: false,
                },
            ],

            // JSX-specific rules
            'react/jsx-no-literals': 1,
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

            // We respect JSX syntax
            '@eslint-react/no-children-prop': 'error',

            // Should clean up codes.
            '@eslint-react/no-useless-fragment': 'warn',

            // We would like to use syntax to swap to other libs easily.
            '@eslint-react/prefer-shorthand-fragment': 'warn',
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
