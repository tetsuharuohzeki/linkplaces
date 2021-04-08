/*eslint-env commonjs*/
/*eslint quote-props: [2, "always"] */

'use strict';

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
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
        'es2021': true,
    },

    'reportUnusedDisableDirectives': true,

    'root': true,

    'rules': {
        'no-magic-numbers': 'off',
    },
};
