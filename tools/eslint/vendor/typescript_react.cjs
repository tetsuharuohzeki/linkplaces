// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_typescript_react.js


'use strict';

module.exports = {
    'extends': [
        './react.cjs',
    ],

    'rules': {
        // This rule should be support `.tsx` because TypeScript only allow jsx syntax in `.tsx` file.
        'react/jsx-filename-extension': ['error', {
            'extensions': ['.jsx', '.tsx'],
        }],
    }
};
