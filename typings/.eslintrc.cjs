/*eslint-env node */
/*eslint quote-props: [2, "always"] */
/* eslint-disable @typescript-eslint/no-require-imports */

'use strict'; // eslint-disable-line strict

const path = require('path');

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
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
