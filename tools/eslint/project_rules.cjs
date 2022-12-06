'use strict';

const rules = Object.freeze({
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
    // FIXME: Re-enable for the future.
    'import/no-unresolved': 'off',
});

const rulesForESModule = Object.freeze({
    'import/extensions': [
        'error',
        'always',
        {
            ignorePackages: true,
        },
    ],
});

module.exports = Object.freeze({
    rules,
    rulesForESModule,
});
