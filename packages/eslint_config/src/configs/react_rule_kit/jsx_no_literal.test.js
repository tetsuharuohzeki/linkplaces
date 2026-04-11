import * as test from 'node:test';

import { default as eslintReactKit } from '@eslint-react/kit';
import { RuleTester } from 'eslint';

import { jsxNoLiterals } from './jsx_no_literal.js';

RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

const RULE_NAME = 'jsx-no-literals';

const rule = eslintReactKit().use(jsxNoLiterals).getPlugin().rules[RULE_NAME];

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
            code: `<bar foo={1}>{text}</bar>`.trim(),
        },
        {
            code: `<bar></bar>`.trim(),
        },
    ],
    invalid: [
        {
            code: '<bar>foo</bar>',
            errors: [
                {
                    message: `String literals should be wrapped as \`{value}\` in JSX expression`,
                },
            ],
            output: `<bar>{'foo'}</bar>`,
        },
        {
            code: '<>foo</>',
            errors: [
                {
                    message: `String literals should be wrapped as \`{value}\` in JSX expression`,
                },
            ],
            output: `<>{'foo'}</>`,
        },
        {
            code: `<>  'foo'   </>`,
            errors: [
                {
                    message: `String literals should be wrapped as \`{value}\` in JSX expression`,
                },
            ],
            output: `<>{\`  'foo'   \`}</>`,
        },
        {
            code: `<>  "foo"   </>`,
            errors: [
                {
                    message: `String literals should be wrapped as \`{value}\` in JSX expression`,
                },
            ],
            output: `<>{\`  "foo"   \`}</>`,
        },
        {
            code: '<bar bar="1"/>',
            errors: [
                {
                    message: `String literals are not wrapped as \`{value}\` JSX props.`,
                },
            ],
            output: '<bar bar={"1"}/>',
        },
        {
            code: '<bar bar=\'1\'/>',
            errors: [
                {
                    message: `String literals are not wrapped as \`{value}\` JSX props.`,
                },
            ],
            output: '<bar bar={\'1\'}/>',
        },
    ],
});
