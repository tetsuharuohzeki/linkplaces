/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env node*/
/*eslint quote-props: [2, "always"] */

'use strict'; // eslint-disable-line strict

const path = require('path');

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        'eslint-config-abema/config/eslintrc_react_hooks.js',
        'eslint-config-abema/config/eslintrc_typescript.js',
        'eslint-config-abema/config/eslintrc_typescript_react.js',
    ],

    'plugins': [
        '@typescript-eslint/tslint',
    ],

    'parserOptions': {
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'project': path.resolve(__dirname, '../tsconfig.json'),
    },

    'env': {
        'browser': true,
        'webextensions': true,
    },

    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
            },
        },
    },


    'rules': {
        'init-declarations': 'off', // Sort the work with TypeScript's `let bar: B;` pattern.
        'react/jsx-curly-brace-presence': 'off', // I seem this rule is too eager.

        '@typescript-eslint/tslint/config': ['error', {
            'lintFile': path.resolve(__dirname, '../tslint.json'),
        }],

        // Please opt-out this rule if you'd like to use this rule.
        '@typescript-eslint/no-explicit-any': ['warn'],
        // Please opt-out this rule if you'd like to use this rule.
        '@typescript-eslint/no-non-null-assertion': ['warn'],
    }
};
