// Copied from https://github.com/cats-oss/eslint-config-abema/blob/72a943d6271704c5e87cf22d803f409a735398b7/config/eslintrc_react.js

'use strict';

module.exports = {
    plugins: ['react'],

    settings: {
        react: {
            version: 'detect', // used for 'no-deprecated' rule.
        },
    },

    // ESLint-plugin-React
    // https://github.com/yannickcr/eslint-plugin-react
    rules: {
        'react/boolean-prop-naming': 0, // We don't want to give special weight to `boolean`.
        'react/button-has-type': 1,
        'react/default-props-match-prop-types': 1,
        'react/display-name': 0, // Auto covered by jsx transformer.
        'react/forbid-component-props': 1,
        'react/forbid-dom-props': [
            1,
            {
                forbid: ['id'],
            },
        ],
        'react/forbid-elements': [
            1,
            {
                forbid: [],
            },
        ],
        'react/forbid-foreign-prop-types': [
            2,
            {
                allowInPropTypes: false, // We doubt this option is really useful.
            },
        ],
        'react/forbid-prop-types': 0,

        // TODO(#298): This rule should be sort with project style.
        'react/function-component-definition': 0,

        'react/no-access-state-in-setstate': 1,
        // The index of `Array<T>` is not suitable for `key` props.
        // But this restriction does not prevent that the id for each items is just a sequence number of some list
        // even if a item has an "unique" id. This rule cannot prevent it. meaningless.
        'react/no-array-index-key': 0,
        'react/no-adjacent-inline-elements': 0,
        'react/no-children-prop': 2, // children should be nested between the opening and closing tags.
        'react/no-deprecated': 2, // Detect deprected styles

        'react/no-direct-mutation-state': 2,
        'react/no-is-mounted': 2,
        'react/no-multi-comp': 0, // Enable to define a multiple component to a single file.
        'react/no-render-return-value': 2,
        'react/no-redundant-should-component-update': 1,
        'react/no-set-state': 0,
        'react/no-string-refs': [
            2,
            {
                noTemplateLiterals: true,
            },
        ],
        'react/no-this-in-sfc': 1,
        'react/no-typos': 0,
        'react/no-unescaped-entities': 2,
        'react/no-unknown-property': 2,
        'react/no-unsafe': 2, // We should ban an unsafe operation.
        'react/no-unused-prop-types': [
            0,
            {
                // XXX: Disable to avoid mis-detection
                customValidators: [],
                skipShapeProps: false,
            },
        ],
        'react/no-unused-state': 1,
        // We don't think this code is produced in a  common case. If you need it, let's opt out/
        'react/no-will-update-set-state': 2,
        // At v7.13, this only supports Flowtype.
        'react/prefer-read-only-props': 'off',
        // See https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 0, // This does not resolve the essence of problem.
        'react/require-optimization': [
            0,
            {
                allowDecorators: [],
            },
        ],
        'react/require-render-return': 2,
        'react/self-closing-comp': [
            2,
            {
                component: true,
                html: false,
            },
        ],
        // A _state_ usually depends on some value hold by its instance.
        // So it's more reasonable way to init in the constructor.
        'react/state-in-constructor': ['error', 'always'],
        // I seem this might be a problematic only for class component,
        // But we lives in the era of hooks and almost properties which is targeted by this rule
        // are classic (non-recommended in today) ones.
        'react/static-property-placement': 'off',
        'react/void-dom-elements-no-children': 1,

        // We define customized rules because we thought default settings mixes with
        // component's arguments and lifecycle methods.
        'react/sort-comp': [
            1,
            {
                order: ['constructor', 'metadata', 'rendering', 'lifecycle', 'everything-else'],
                groups: {
                    metadata: [
                        'displayName',
                        'propTypes',
                        'contextTypes',
                        'childContextTypes',
                        'mixins',
                        'getDefaultProps',
                        'getInitialState',
                        'getChildContext',
                    ],
                    rendering: ['type-annotations', 'render', '/^render.+$/'],
                },
            },
        ],
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
        'react/jsx-key': [
            1,
            {
                checkFragmentShorthand: true,
                checkKeyMustBeforeSpread: false,
            },
        ],
        'react/jsx-max-depth': 0, // We should not restrict this by default.
        'react/jsx-no-bind': [
            2,
            {
                // Sort to bind with this in constructor.
                ignoreDOMComponents: true,
                ignoreRefs: true, // we may use `refs`.
                allowArrowFunctions: true,
                allowBind: false,
            },
        ],
        'react/jsx-no-comment-textnodes': 2,
        'react/jsx-no-constructed-context-values': 'warn',
        'react/jsx-no-duplicate-props': 2,
        'react/jsx-no-literals': 1,
        'react/jsx-no-script-url': 2,
        'react/jsx-no-target-blank': [
            1,
            {
                // see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
                enforceDynamicLinks: 'always',
                // For legacy browsers which does not support `rel=noopener`, this option is useful.
                // But almost modern browser support it. We don't have to turn off this option
                // if we don't care about legacy browsers (IE11 & legacy Edge!).
                // If you need to support legacy IE11 & legacy Edge, turn off this option.
                // See also
                //  * https://caniuse.com/#feat=rel-noopener
                //  * https://mathiasbynens.github.io/rel-noopener
                //  * https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer
                allowReferrer: true,
                warnOnSpreadAttributes: true,
            },
        ],
        'react/jsx-no-undef': 2,
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
        'react/jsx-pascal-case': [
            2,
            {
                allowAllCaps: false,
                ignore: [],
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
        // See https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
        'react/jsx-uses-react': 'off',
        'react/jsx-uses-vars': 1,
    },
};
