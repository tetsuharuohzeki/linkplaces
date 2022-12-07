import importPlugin from 'eslint-plugin-import';

import projectRules from '../project_rules.cjs';
import corePresets from '../vendor/core.cjs';
import importPresets from '../vendor/import.cjs';

import { config as prettierRules } from './prettier.js';

export const config = Object.freeze({
    plugins: {
        import: importPlugin,
    },
    rules: {
        ...corePresets.rules,
        ...importPresets.rules,
        ...prettierRules.rules,
        ...projectRules.rules,
        'import/extensions': [
            'error',
            'always',
            {
                ignorePackages: true,
            },
        ],
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
