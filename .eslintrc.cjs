/*eslint-env node*/
/*eslint quote-props: [2, "always"] */

'use strict';

const path = require('path');

const TSCONFIG_PATH = path.resolve(__dirname, './tsconfig.eslint.json');

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        './tools/eslint/core.cjs',
        './tools/eslint/import.cjs',
        './tools/eslint/prettier.cjs',
    ],

    'parserOptions': {
        'ecmaVersion': 2022,
        'sourceType': 'module',
    },

    'env': {
        'es2021': true,
    },

    'reportUnusedDisableDirectives': true,

    'root': true,

    'rules': {
        'no-magic-numbers': 'off',
        'no-unused-private-class-members': 'warn',

        // Disable until vscode's Electron's node.js will become Node.js v16
        'import/no-unresolved': 'off',
    },

    'overrides': [
        {
            'files': ['*.cjs'],
            'parserOptions': {
                'sourceType': 'script',
            },
        },
        {
            'files': ['*.js', '*.mjs'],
            'parserOptions': {
                'sourceType': 'module',
            },

            'rules': {
                'import/extensions': ['error', 'always', {
                    'ignorePackages': true,
                }],
            },
        },
        {
            'files': ['*.ts', '*.tsx', '*.d.ts'],

            'extends': [
                'plugin:react-hooks/recommended',
                './tools/eslint/typescript.cjs',
                './tools/eslint/typescript_react.cjs',
                './tools/eslint/prettier.cjs',
            ],

            'parserOptions': {
                'sourceType': 'module',
                'ecmaFeatures': {
                    'jsx': true
                },
                'project': TSCONFIG_PATH,
                'extraFileExtensions': ['.cjs'],
            },

            'globals': {
                // see https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
                'JSX': 'readonly',
            },

            'rules': {
                // FIXME: Re-enable for the future.
                '@typescript-eslint/member-ordering': 'off',

                'react/no-arrow-function-lifecycle': 'error',
            },
        },
    ],
};
