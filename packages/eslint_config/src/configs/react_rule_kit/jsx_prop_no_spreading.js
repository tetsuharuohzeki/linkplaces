// https://github.com/jsx-eslint/eslint-plugin-react/blob/012ec39f962627d5312e9fbaee3eb41d9a4d8bb6/lib/rules/jsx-props-no-spreading.js

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

function isProperty(property) {
    const ok = property.type === 'Property';
    return ok;
}

/**
 * @returns {RuleFunction}
 */
export function jsxPropsNoSpreading() {
    return (context) => ({
        JSXSpreadAttribute(node) {
            const argument = node.argument;

            // ignoreExplicitSpread
            if (argument.type === 'ObjectExpression' && argument.properties.every(isProperty)) {
                return;
            }

            context.report({
                node,
                message: 'Props spreading is not allowed.',
            });
        },
    });
}
