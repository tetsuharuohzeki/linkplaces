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

    'rules': {
        'no-unused-vars': 'off', // FIXME: Re-enable
        'init-declarations': 'off', // FIXME: Re-enable
        'import/no-unresolved': 'off', // FIXME: Re-enable

        '@typescript-eslint/tslint/config': ['error', {
            'lintFile': path.resolve(__dirname, '../tslint.json'),
        }],
    }
};
