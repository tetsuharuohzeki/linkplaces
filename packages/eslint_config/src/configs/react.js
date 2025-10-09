// @ts-check

import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';
import { FILE_PATTERN_TS } from './file_patterns.js';

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

    {
        files: FILE_PATTERN_TS,
        extends: [eslintReact.configs['recommended-typescript']],
        rules: {
            // Enforce to specify html's boolean type attribute.
            '@eslint-react/jsx-shorthand-boolean': [
                'error',
                // This should be set `-1` to warn shorthand boolean
                // ref https://github.com/Rel1cx/eslint-react/blob/5d8e0c5f7f6ca254f66e3c59a9d24f4483431fda/packages/plugins/eslint-plugin-react-x/src/rules/jsx-shorthand-boolean.ts#L75C25-L86
                -1,
            ],

            // We don't have to use a react class component excluding some situations
            // that you need to implement react error boundary with `getDerivedStateFromError()`.
            // See:
            //  - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
            //  - https://react.dev/reference/react/Component#static-getderivedstatefromerror
            //  - https://eslint-react.xyz/docs/rules/no-class-component
            '@eslint-react/no-class-component': 'error',

            // We respect JSX syntax
            '@eslint-react/no-children-prop': 'error',

            // Improve the debuggability on react devtools.
            '@eslint-react/no-missing-component-display-name': 'warn',
            '@eslint-react/no-missing-context-display-name': 'warn',

            // Should clean up codes.
            '@eslint-react/no-useless-fragment': 'warn',

            // We would like to use syntax to swap to other libs easily.
            '@eslint-react/jsx-shorthand-fragment': [
                'warn',
                // This should be set `-1` to warn non shorthand syntax
                // See https://github.com/Rel1cx/eslint-react/blob/5d8e0c5f7f6ca254f66e3c59a9d24f4483431fda/packages/plugins/eslint-plugin-react-x/src/rules/jsx-shorthand-fragment.ts#L63-L84
                1,
            ],
        },
    },

    {
        files: FILE_PATTERN_TS,
        extends: [reactHooksESLintPlugin.configs.flat['recommended-latest']],
        rules: {},
    },
]);
