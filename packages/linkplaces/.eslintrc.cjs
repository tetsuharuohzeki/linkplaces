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
    ],
};
