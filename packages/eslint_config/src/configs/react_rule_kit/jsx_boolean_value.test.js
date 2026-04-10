import * as test from 'node:test';

import { default as eslintReactKit } from '@eslint-react/kit';
import { RuleTester } from 'eslint';

import { jsxBooleanValue } from './jsx_boolean_value.js';

RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

const RULE_NAME = 'jsx-boolean-value';

const rule = eslintReactKit().use(jsxBooleanValue).getPlugin().rules[RULE_NAME];

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
        message: 'Supply the value for boolean attributes explicitly',
    },
];

ruleTester.run(RULE_NAME, rule, {
    valid: [
        {
            code: "<a value={'true'}/>",
        },
        {
            code: "<a value={'false'}/>",
        },
        {
            code: '<a value={false}/>',
        },
        {
            code: '<a value={true}/>',
        },
        {
            code: '<a value={!!1}/>',
        },
        {
            code: '<a value={!1}/>',
        },
        {
            code: '<a value={!!0}/>',
        },
        {
            code: '<a value={!0}/>',
        },
    ],
    invalid: [
        {
            code: '<a value/>',
            errors,
            output: '<a value={true}/>',
        },
        {
            code: '<a value></a>',
            errors,
            output: '<a value={true}></a>',
        },
    ],
});
