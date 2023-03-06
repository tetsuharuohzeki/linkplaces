import importPlugin from 'eslint-plugin-import';

import { config as prettierRules } from './prettier.js';
import corePresets from './vendor/core.cjs';
import importPresets from './vendor/import.cjs';


const projectRules = Object.freeze({
    'no-constant-binary-expression': 'error',
    'no-magic-numbers': 'off',
    'no-unused-private-class-members': 'warn',

    'no-restricted-imports': [
        'error',
        {
            paths: [
                'option-t/cjs/Option',
                'option-t/cjs/Result',
                'option-t/esm/Option',
                'option-t/esm/Result',
                'option-t/lib/Option',
                'option-t/lib/Result',
            ],
        },
    ],
});

export const rulesForESModule = Object.freeze({
    'import/extensions': [
        'error',
        'always',
        {
            ignorePackages: true,
        },
    ],
});

export const config = Object.freeze({
    plugins: {
        import: importPlugin,
    },
    rules: {
        ...corePresets.rules,
        ...importPresets.rules,
        ...prettierRules.rules,
        ...projectRules,
        ...rulesForESModule,
    },
    settings: {
        ...importPresets.settings,
        'import/parsers': {
            '@typescript-eslint/parser': [
                ...['.ts', '.tsx', '.mts', '.cts'],
                // We need to specify this due to avoid `Parse errors in imported module './prettier.js': parserPath is required!`
                ...['.js', '.mjs', '.cjs'],
            ],
        },
    },
});