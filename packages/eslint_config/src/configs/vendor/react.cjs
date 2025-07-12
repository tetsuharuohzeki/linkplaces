// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_react.js

'use strict';

module.exports = {
    plugins: ['react'],

    // ESLint-plugin-React
    // https://github.com/yannickcr/eslint-plugin-react
    rules: {
        'react/boolean-prop-naming': 0, // We don't want to give special weight to `boolean`.
        'react/button-has-type': 1,

        'react/no-access-state-in-setstate': 1,
        // The index of `Array<T>` is not suitable for `key` props.
        // But this restriction does not prevent that the id for each items is just a sequence number of some list
        // even if a item has an "unique" id. This rule cannot prevent it. meaningless.
        'react/no-array-index-key': 0,
        'react/no-adjacent-inline-elements': 0,

        'react/no-multi-comp': 0, // Enable to define a multiple component to a single file.
        'react/no-typos': 0,
        'react/no-unsafe': 2, // We should ban an unsafe operation.
        'react/no-unused-prop-types': [
            0,
            {
                // XXX: Disable to avoid mis-detection
                customValidators: [],
                skipShapeProps: false,
            },
        ],
        // At v7.13, this only supports Flowtype.
        'react/prefer-read-only-props': 'off',
        'react/require-default-props': 0, // This does not resolve the essence of problem.
        'react/require-optimization': [
            0,
            {
                allowDecorators: [],
            },
        ],
        'react/self-closing-comp': [
            2,
            {
                component: true,
                html: false,
            },
        ],
        // I seem this might be a problematic only for class component,
        // But we lives in the era of hooks and almost properties which is targeted by this rule
        // are classic (non-recommended in today) ones.
        'react/static-property-placement': 'off',
        'react/void-dom-elements-no-children': 1,

        'react/sort-prop-types': [
            0,
            {
                // we cannot force alphabetical order to our old codebase.
                callbacksLast: true,
                requiredFirst: true,
            },
        ],
        'react/style-prop-object': 2,

        // JSX-specific rules
        'react/jsx-boolean-value': [2, 'always'], // Enforce to specify html's boolean type attribute.
        'react/jsx-fragments': 'off', // I don't think enforce the style for this.
        'react/jsx-handler-names': [
            2,
            {
                eventHandlerPrefix: 'on', // There is no event handler which is diffrent from this rules (`onBarFoo`).
                eventHandlerPropPrefix: 'on',
                checkLocalVariables: false,
            },
        ],
        'react/jsx-max-depth': 0, // We should not restrict this by default.
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
        // This is good for maintainability by avoiding passing unintentional extra props.
        'react/jsx-props-no-spreading': [
            'error',
            {
                html: 'enforce',
                custom: 'enforce',
                explicitSpread: 'enforce',
                exceptions: [],
            },
        ],
        'react/jsx-sort-default-props': 0,
        'react/jsx-sort-props': 0, // we cannot force alphabetical order to our old codebase, and this is meaningless.
    },
};
