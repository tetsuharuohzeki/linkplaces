import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import {
    coreConfig,
    importConfig,
    languageOptionsForModule,
    languageOptionsForCommonJS,
    languageOptionsForTesting,
    prettierConfigs,
    reactConfig,
    createlanguageOptionsForTypeScript,
    configForTypeScript,
} from '@linkplaces/eslint_config';
import turboConfig from 'eslint-config-turbo/flat';

const THIS_FILE_NAME = fileURLToPath(import.meta.url);
const THIS_DIR_NAME = path.dirname(THIS_FILE_NAME);

const FILE_PATTERN_JS_ESM = ['**/*.mjs', '**/*.js'];
const FILE_PATTERN_JS_CJS = ['**/*.cjs'];
const FILE_PATTERN_TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export -- ESLint requires default export.
export default [
    js.configs.recommended,
    coreConfig,
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
        languageOptions: createlanguageOptionsForTypeScript(THIS_DIR_NAME),
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
    {
        files: FILE_PATTERN_TS,
        ...reactConfig.config,
    },

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
    ...turboConfig,
    ...prettierConfigs,
];
