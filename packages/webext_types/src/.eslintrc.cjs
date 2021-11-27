/*eslint-env node */
/*eslint quote-props: [2, "always"] */

'use strict';

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'plugins': ['@typescript-eslint'],
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
