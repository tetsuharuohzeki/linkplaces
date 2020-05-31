/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env node */
/*eslint quote-props: [2, "always"] */
/* eslint-disable @typescript-eslint/no-require-imports */

'use strict'; // eslint-disable-line strict

const path = require('path');

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        'eslint-config-abema/config/eslintrc_typescript.js',
    ],

    'parserOptions': {
        'sourceType': 'module',
        'project': path.resolve(__dirname, '../tsconfig.eslint.json'),
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
        // These typings are not parts of this project.
        '@typescript-eslint/naming-convention': 'off',
    }
};
