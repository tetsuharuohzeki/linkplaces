import { default as eslintReactKit } from '@eslint-react/kit';

import { jsxBooleanValue } from './react_rule_kit/jsx_boolean_value.js';
import { jsxFragments } from './react_rule_kit/jsx_fragments.js';
import { jsxNoLiterals } from './react_rule_kit/jsx_no_literal.js';
import { jsxPropsNoSpreading } from './react_rule_kit/jsx_prop_no_spreading.js';

export function getESLintReactKitConfig() {
    const builder = eslintReactKit()
        // @prettier-ignore
        .use(jsxBooleanValue)
        .use(jsxFragments)
        .use(jsxNoLiterals)
        .use(jsxPropsNoSpreading);

    const configs = builder.getConfig();

    return configs;
}
