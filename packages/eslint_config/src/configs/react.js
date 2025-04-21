import assert from 'node:assert/strict';

import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';

import reactPresets from './vendor/react.cjs';
import tsReactPresets from './vendor/typescript_react.cjs';

const reactHooksPluginRecommendedConfigRules = reactHooksESLintPlugin.configs.recommended.rules;
assert(reactHooksPluginRecommendedConfigRules);
const reactPluginJsxRuntimeRules = reactESLintPlugin.configs['jsx-runtime'].rules;
assert(reactPluginJsxRuntimeRules);

const plugins = Object.freeze({
    react: reactESLintPlugin,
    'react-hooks': reactHooksESLintPlugin,
});

/**
 *  @type   {import('eslint').Linter.FlatConfig}
 */
export const config = Object.freeze({
    plugins,
    rules: {
        ...reactHooksPluginRecommendedConfigRules,
        ...reactPresets.rules,
        ...reactPluginJsxRuntimeRules,

        ...tsReactPresets.rules,

        // We would like to use syntax to swap to other libs easily.
        'react/jsx-fragments': ['warn', 'syntax'],
        // We would like to remove useless fragment.
        'react/jsx-no-useless-fragment': [
            'warn',
            {
                // We allow for typescript's typecheck
                allowExpressions: true,
            },
        ],

        'react/no-arrow-function-lifecycle': 'error',

        'react-hooks/react-compiler': 'error',
    },

    settings: {
        react: {
            version: '18.2',
        },
    },
});
