import * as test from 'node:test';

import { default as eslintReactKit } from '@eslint-react/kit';
import { RuleTester } from 'eslint';

import { jsxSelfClosing } from './jsx_self_closing.js';

RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

const RULE_NAME = 'jsx-self-closing';

const rule = eslintReactKit().use(jsxSelfClosing).getPlugin().rules[RULE_NAME];

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
        message: 'Empty components are self-closing',
    },
];

ruleTester.run(RULE_NAME, rule, {
    valid: [
        {
            code: `
            <a/>
            `.trim(),
        },
        {
            code: `
            <a></a>
            `.trim(),
        },
        {
            code: `
            <a


            />
            `.trim(),
        },
        {
            code: `
            <a        aasa        />
            `.trim(),
        },
        {
            code: `
<Bar
hoge="a"

fuu="a"
> </Bar>`.trim(),
        },
    ],
    invalid: [
        {
            code: `<Bar></Bar>`,
            errors,
            output: `<Bar/>`,
        },
        {
            code: `
<Bar


></Bar>`.trim(),
            errors,
            output: `
<Bar


/>`.trim(),
        },
        {
            code: `
<Bar
hoge="a"

fuu="a"
></Bar>`.trim(),
            errors,
            output: `
<Bar
hoge="a"

fuu="a"
/>`.trim(),
        },
    ],
});
