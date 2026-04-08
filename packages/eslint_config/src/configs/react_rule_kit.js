import { default as eslintReactKit } from '@eslint-react/kit';

import { jsxBooleanValue } from './react_rule_kit/jsx_boolean_value.js';
import { jsxFragments } from './react_rule_kit/jsx_fragments.js';

export function getESLintReactKitConfig() {
    const builder = eslintReactKit()
        // @prettier-ignore
        .use(jsxBooleanValue)
        .use(jsxFragments);

    const configs = builder.getConfig();

    return configs;
}
