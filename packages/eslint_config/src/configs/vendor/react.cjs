// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_react.js

'use strict';

module.exports = {
    plugins: ['react'],

    // ESLint-plugin-React
    // https://github.com/yannickcr/eslint-plugin-react
    rules: {
        'react/self-closing-comp': [
            2,
            {
                component: true,
                html: false,
            },
        ],

        // JSX-specific rules
        'react/jsx-no-literals': 1,
    },
};
