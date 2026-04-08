// @ts-check

import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';
import { FILE_PATTERN_TS } from './file_patterns.js';

import { getESLintReactKitConfig } from './react_rule_kit.js';

/**
 *  @type   {ReadonlyArray<import('eslint').Linter.Config>}
 */
export const reactConfigs = defineConfig([
    // @prettier-ignore
    {
        files: FILE_PATTERN_TS,
        plugins: {
            react: reactESLintPlugin,
        },
        rules: {
        },
    },

    {
        files: FILE_PATTERN_TS,
        extends: [
            // @prettier-ignore
            eslintReact.configs['strict-typescript'],
            getESLintReactKitConfig(),
        ],
        rules: {
            // We don't have to use a react class component excluding some situations
            // that you need to implement react error boundary with `getDerivedStateFromError()`.
            // See:
            //  - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
            //  - https://react.dev/reference/react/Component#static-getderivedstatefromerror
            //  - https://eslint-react.xyz/docs/rules/no-class-component
            '@eslint-react/no-class-component': 'error',

            // We respect JSX syntax
            '@eslint-react/jsx-no-children-prop': 'error',

            // Improve the debuggability on react devtools.
            '@eslint-react/no-missing-component-display-name': 'warn',
            '@eslint-react/no-missing-context-display-name': 'warn',

            // Should clean up codes.
            '@eslint-react/jsx-no-useless-fragment': 'warn',
        },
    },

    {
        files: FILE_PATTERN_TS,
        extends: [reactHooksESLintPlugin.configs.flat['recommended-latest']],
        rules: {},
    },
]);
