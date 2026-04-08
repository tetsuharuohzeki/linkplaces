/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

/**
 *  See also https://github.com/jsx-eslint/eslint-plugin-react/blob/012ec39f962627d5312e9fbaee3eb41d9a4d8bb6/lib/rules/jsx-boolean-value.js
 *  @returns {RuleFunction}
 */
export function jsxBooleanValue() {
    return (context) => ({
        JSXAttribute(node) {
            const value = node.value;
            if (value === null) {
                context.report({
                    node,
                    message: 'Supply the value for boolean attributes explicitly',
                    fix(fixer) {
                        return fixer.insertTextAfter(node, '={true}');
                    },
                });
            }
        },
    });
}
