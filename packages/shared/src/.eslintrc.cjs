/*eslint-env commonjs*/
/*eslint quote-props: [2, "always"] */

'use strict';

const JS_EXTENSION = ['.mjs', '.js', '.jsx'];
const TS_EXTENSION = ['.ts', '.tsx', '.d.ts'];
const ALL_EXTENSION = [...TS_EXTENSION, ...JS_EXTENSION];

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'env': {
        'browser': true,
        'webextensions': true,
    },

    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ALL_EXTENSION,
            },
        },
    },
};
