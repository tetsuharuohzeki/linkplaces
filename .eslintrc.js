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
        './tools/eslint/eslintrc_core.js',
        './tools/eslint/eslintrc_react.js',
    ],

    'parserOptions': {
        'ecmaVersion': 2017,
    },

    'env': {
        'es6': true,
    },

    'root': true,

    'rules': {
    }
};
