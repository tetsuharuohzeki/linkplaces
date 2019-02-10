/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env node */
/*eslint quote-props: [2, "always"] */

'use strict'; // eslint-disable-line strict

const path = require('path');

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
        '@typescript-eslint/tslint',
    ],

    'parserOptions': {
        'sourceType': 'module',
        'project': path.resolve(__dirname, '../tsconfig.json'),
    },

    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.d.ts'],
            },
        },

        // By default, this option does not include `.jsx` extension.
        'import/extensions': [
            '.d.ts',
        ],
    },

    'rules': {
        '@typescript-eslint/tslint/config': ['error', {
            'lintFile': path.resolve(__dirname, '../tslint.json'),
        }],

        // the default `no-unused-vars` is not support type annotations.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {
            'vars': 'all',
            'args': 'after-used',
            'argsIgnorePattern': '^_', // Sort with TypeScript compiler's builtin linter.
            'caughtErrors': 'all',
            'caughtErrorsIgnorePattern': '^_', // Allow `catch (_e) {...}`
        }],

        // Please opt-out this rule if you'd like to use this rule.
        '@typescript-eslint/no-explicit-any': ['warn'],
        // Please opt-out this rule if you'd like to use this rule.
        '@typescript-eslint/no-non-null-assertion': ['warn'],
    }
};
