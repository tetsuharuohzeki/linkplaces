import * as test from 'node:test';

import { default as eslintReactKit } from '@eslint-react/kit';
import { RuleTester } from 'eslint';

import { jsxPropsNoSpreading } from './jsx_prop_no_spreading.js';

RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

const RULE_NAME = 'jsx-props-no-spreading';

const rule = eslintReactKit().use(jsxPropsNoSpreading).getPlugin().rules[RULE_NAME];

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

const errors = [
    {
        message: 'Props spreading is not allowed.',
    },
];

ruleTester.run(RULE_NAME, rule, {
    valid: [
        {
            code: `
            <a></a>
            `.trim(),
        },
        {
            code: `
            <a/>
            `.trim(),
        },
        {
            code: `
            <a {...{ a, b, }}/>
            `.trim(),
        },
        {
            code: `
            <a {...{ a, b, }}></a>
            `.trim(),
        },
    ],
    invalid: [
        {
            code: '<a {...b}/>',
            errors,
        },
        {
            code: '<a {...b}></a>',
            errors,
        },
        {
            code: `
            <a a={true} {...b}/>
            `.trim(),
            errors,
        },
        {
            code: `
            <a {...b} a={true}/>
            `.trim(),
            errors,
        },
    ],
});
