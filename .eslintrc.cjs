/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env commonjs*/
/*eslint quote-props: [2, "always"] */

'use strict';

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        'eslint-config-abema/config/eslintrc_core.js',
        'eslint-config-abema/config/eslintrc_import.js',
    ],

    'parserOptions': {
        'ecmaVersion': 2020,
        'parserOptions': {
            'sourceType': 'module',
        },
    },

    'env': {
        'es6': true,
    },

    'reportUnusedDisableDirectives': true,

    'root': true,

    'rules': {
        'no-magic-numbers': 'off',
    },

    'overrides': [
        {
            'files': ['*.cjs'],
            'parserOptions': {
                'sourceType': 'script',
            },
        },
        {
            'files': ['*.mjs'],
            'parserOptions': {
                'sourceType': 'module',
            },

            'rules': {
                'import/extensions': ['error', 'always', {
                    'ignorePackages': true,
                }],
            },
        },
    ],
};
