import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';

import { config as coreConfig } from './tools/eslint/new_config/core.js';
import {
    languageOptionsForModule,
    languageOptionsForCommonJS,
    languageOptionsForTesting,
} from './tools/eslint/new_config/language_options.js';
import { linterOptions } from './tools/eslint/new_config/linter_options.js';
import {
    createlanguageOptionsForTypeScript,
    config as configForTypeScript,
} from './tools/eslint/new_config/typescript.js';

const THIS_FILE_NAME = fileURLToPath(import.meta.url);
const THIS_DIR_NAME = path.dirname(THIS_FILE_NAME);

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export -- ESLint requires default export.
export default [
    js.configs.recommended,
    coreConfig,
    {
        linterOptions,
    },
    {
        ignores: [
            // @prettier-ignore

            // Generated files
            '**/__dist/**/*',
            '**/__obj/**/*',
            '**/__plain/**/*',
        ],
    },
    {
        files: ['**/*.mjs', '**/*.js'],
        languageOptions: languageOptionsForModule,
    },
    {
        files: ['**/*.cjs'],
        languageOptions: languageOptionsForCommonJS,
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
        languageOptions: createlanguageOptionsForTypeScript(THIS_DIR_NAME),
        ...configForTypeScript,
    },
    {
        files: ['packages/webext_types/src/**/*.ts'],
        rules: {
            // These typings are not parts of this project.
            '@typescript-eslint/naming-convention': 'off',
        },
    },
    {
        files: ['**/__tests__/*'],
        ignores: ['**/.eslintrc.cjs'],
        languageOptions: languageOptionsForTesting,
        rules: {
            // FIXME: This should be enabled.
            'import/no-unresolved': 'off',
        },
    },
];
