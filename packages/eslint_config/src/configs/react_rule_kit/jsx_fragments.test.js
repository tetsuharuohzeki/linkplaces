import * as test from 'node:test';

import { default as eslintReactKit } from '@eslint-react/kit';
import { RuleTester } from 'eslint';

import { jsxFragments } from './jsx_fragments.js';

RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

const RULE_NAME = 'jsx-fragments';

const rule = eslintReactKit().use(jsxFragments).getPlugin().rules[RULE_NAME];

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run(RULE_NAME, rule, {
    valid: [
        {
            code: `<></>`.trim(),
        },
        {
            code: `<>aaa</>`.trim(),
        },
    ],
    invalid: [
        {
            code: '<Fragment>foo</Fragment>',
            errors: [
                {
                    message: `Use shorthand fragment syntax '<>...</>'.`,
                },
            ],
            output: `<>foo</>`,
        },
        {
            code: '<React.Fragment>foo</React.Fragment>',
            errors: [
                {
                    message: `Use shorthand fragment syntax '<>...</>'.`,
                },
            ],
            output: `<>foo</>`,
        },
    ],
});
