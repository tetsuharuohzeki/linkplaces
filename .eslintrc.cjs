/*eslint-env node*/
/*eslint quote-props: [2, "always"] */

'use strict';

const languageOptions = require('./tools/eslint/language_option.cjs');
const linterOptions = require('./tools/eslint/liniter_option.cjs');
const projectRules = require('./tools/eslint/project_rules.cjs');
const typescriptSettings = require('./tools/eslint/typescript.cjs');

// ESLint Configuration Files enables to include comments.
// https://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        './tools/eslint/vendor/core.cjs',
        './tools/eslint/vendor/import.cjs',
        './tools/eslint/prettier.cjs',
    ],

    'parserOptions': {
        'ecmaVersion': languageOptions.ecmaVersion,
        'sourceType': 'module',
    },

    'env': {
        'es2021': true,
    },

    'reportUnusedDisableDirectives': linterOptions.reportUnusedDisableDirectives,

    'root': true,

    'rules': projectRules.rules,

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

            'rules': projectRules.rulesForESModule,
        },
        {
            'files': ['*.ts', '*.tsx', '*.d.ts'],

            'extends': [
                'plugin:react-hooks/recommended',
                './tools/eslint/vendor/typescript.cjs',
                './tools/eslint/vendor/typescript_react.cjs',
                './tools/eslint/prettier.cjs',
            ],

            'parserOptions': typescriptSettings.createParserOptions(__dirname),
            'globals': typescriptSettings.globals,
            'rules': typescriptSettings.rules,
        },
    ],
};
