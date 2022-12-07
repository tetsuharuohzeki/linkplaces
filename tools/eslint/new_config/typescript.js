import tsESLintPlugin from '@typescript-eslint/eslint-plugin';
import tsESLintParser from '@typescript-eslint/parser';
import reactESLintPlugin from 'eslint-plugin-react';
import reactHooksESLintPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

import tsconfigMod from '../typescript.cjs';
import tsPresets from '../vendor/typescript.cjs';
import tsReactPresets from '../vendor/typescript_react.cjs';

const { createParserOptions, globals: tsGlobals } = tsconfigMod;

export function createlanguageOptionsForTypeScript(baseDir) {
    const parserOptions = createParserOptions(baseDir);

    return Object.freeze({
        sourceType: 'module',
        globals: {
            ...globals.builtin,
            ...globals.browser,
            ...globals.webextensions,
            ...tsGlobals,
        },
        parser: tsESLintParser,
        parserOptions: {
            project: parserOptions.project,
            ecmaFeatures: parserOptions.ecmaFeatures,
            extraFileExtensions: parserOptions.extraFileExtensions,
        },
    });
}

export const config = Object.freeze({
    plugins: {
        '@typescript-eslint': tsESLintPlugin,
        react: reactESLintPlugin,
        'react-hooks': reactHooksESLintPlugin,
    },
    rules: {
        ...reactHooksESLintPlugin.configs.recommended.rules,
        ...tsPresets.rules,
        ...tsReactPresets.rules,
        ...tsconfigMod.rules,

        'import/extensions': [
            'error',
            'always',
            {
                ignorePackages: true,
            },
        ],

        // Use TypeScript's checking instead.
        'import/no-unresolved': 'off',
    },
});
