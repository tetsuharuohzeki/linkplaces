import path from 'node:path';
import { fileURLToPath } from 'node:url';

import css from '@eslint/css';
import js from '@eslint/js';

import { defineConfig } from 'eslint/config';
import turboConfig from 'eslint-config-turbo/flat';
import { config as coreConfig } from './configs/core.js';
import {
    FILE_PATTERN_CSS,
    FILE_PATTERN_JS_ESM,
    FILE_PATTERN_JS_CJS,
    FILE_PATTERN_TS,
    FILE_PATTERNS_ALL_JS_AND_TS,
} from './configs/file_patterns.js';
import * as importConfig from './configs/import.js';
import {
    languageOptionsForModule,
    languageOptionsForCommonJS,
    languageOptionsForTesting,
} from './configs/language_options.js';
import { configs as prettierConfigs } from './configs/prettier.js';
import * as reactConfig from './configs/react.js';
import { createlanguageOptionsForTypeScript, config as configForTypeScript } from './configs/typescript.js';

const THIS_FILE_NAME = fileURLToPath(import.meta.url);
const THIS_DIR_NAME = path.dirname(THIS_FILE_NAME);
const WORKSPACE_ROOT_DIR_NAME = path.resolve(THIS_DIR_NAME, '..');
const REPO_ROOT_DIR_NAME = path.resolve(WORKSPACE_ROOT_DIR_NAME, '..', '..');

// eslint-disable-next-line import/no-default-export -- ESLint requires default export.
export default defineConfig([
    {
        files: FILE_PATTERNS_ALL_JS_AND_TS,
        ...js.configs.recommended,
    },
    {
        files: FILE_PATTERNS_ALL_JS_AND_TS,
        ...coreConfig,
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'warn',
            reportUnusedInlineConfigs: 'warn',
        },
    },
    {
        ignores: [
            // @prettier-ignore

            // Generated files
            '**/__dist/**/*',
            '**/__obj/**/*',
            '**/__plain/**/*',

            // turborepo
            '**/.turbo/**/*',
        ],
    },
    {
        files: FILE_PATTERN_JS_ESM,
        languageOptions: languageOptionsForModule,
    },

    {
        files: FILE_PATTERN_JS_CJS,
        languageOptions: languageOptionsForCommonJS,
    },
    {
        files: FILE_PATTERN_TS,
        languageOptions: createlanguageOptionsForTypeScript(REPO_ROOT_DIR_NAME),
        ...configForTypeScript,
    },

    // eslint-plugin-import
    {
        files: FILE_PATTERN_JS_ESM,
        ...importConfig.configForJavaScriptESM,
    },
    {
        files: FILE_PATTERN_JS_CJS,
        ...importConfig.configForJavaScriptCJS,
    },
    {
        files: FILE_PATTERN_TS,
        ...importConfig.configForTypeScript,
    },

    // for react
    ...reactConfig.configs.map((config) => {
        return {
            files: FILE_PATTERN_TS,
            ...config,
        };
    }),

    {
        files: ['packages/webext_types/src/**/*.ts'],
        rules: {
            // These typings are not parts of this project.
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
        },
    },
    {
        files: ['**/__tests__/*'],
        languageOptions: languageOptionsForTesting,
    },
    {
        files: FILE_PATTERN_CSS,
        language: 'css/css',
        ...css.configs.recommended,
    },
    {
        files: FILE_PATTERN_CSS,
        plugins: {
            css,
        },
        language: 'css/css',
        rules: {
            'css/use-baseline': 'off', // This project only works for Firefox.
            'css/prefer-logical-properties': 'warn',
        },
    },
    ...turboConfig,
    ...prettierConfigs,
]);
