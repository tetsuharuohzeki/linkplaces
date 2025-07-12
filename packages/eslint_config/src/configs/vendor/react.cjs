// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_react.js

'use strict';

module.exports = {
    plugins: ['react'],

    // ESLint-plugin-React
    // https://github.com/yannickcr/eslint-plugin-react
    rules: {
        'react/no-access-state-in-setstate': 1,

        'react/self-closing-comp': [
            2,
            {
                component: true,
                html: false,
            },
        ],

        'react/style-prop-object': 2,

        // JSX-specific rules
        'react/jsx-boolean-value': [2, 'always'], // Enforce to specify html's boolean type attribute.
        'react/jsx-handler-names': [
            2,
            {
                eventHandlerPrefix: 'on', // There is no event handler which is diffrent from this rules (`onBarFoo`).
                eventHandlerPropPrefix: 'on',
                checkLocalVariables: false,
            },
        ],
        'react/jsx-no-constructed-context-values': 'warn',
        'react/jsx-no-literals': 1,
        'react/jsx-no-script-url': 2,
        // This rule is conservative choice for plain JS world.
        'react/jsx-curly-brace-presence': [
            'warn',
            {
                // In JSX syntax, `props` is not a string in many cases.
                // And in plain JavaScript worlds, we don't have any static type checks,
                // we need think about whether we should add a bracket or not by the type of props.
                // It's pretty tired thing.
                // For sorting style and avoid this tired thing, I prefer to write bracket always.
                props: 'always',
                // I think we also enable this for children,
                // but the current rule impl. is pretty buggy and noisey. It's better to disable it.
                children: 'ignore',
            },
        ],
    },
};
