// @ts-check

// https://github.com/jsx-eslint/eslint-plugin-react/blob/012ec39f962627d5312e9fbaee3eb41d9a4d8bb6/lib/rules/jsx-no-literals.js
// https://www.eslint-react.xyz/docs/migrating-from-eslint-plugin-react#jsx-no-literals

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

/**
 *  @typedef    {Object}    JsxNoLiteralsOptions
 *  @property   {boolean=}  ignoreProps
 *      When `true` the rule ignores literals used in props.
 */

/**
 * @param   {JsxNoLiteralsOptions=} options
 * @returns {RuleFunction}
 */
export function jsxNoLiterals(options = {}) {
    const { ignoreProps = false } = options;
    return function jsxNoLiteralsImpl(context) {
        return {
            JSXAttribute(node) {
                if (ignoreProps) {
                    return;
                }

                const prop = node.name;
                if (prop.type !== 'JSXIdentifier') {
                    // this is unknown tree structure.
                    return;
                }

                const value = node.value;
                if (!value || value.type !== 'Literal') {
                    return;
                }

                const text = value.value;
                context.report({
                    node,
                    message: `String literals are not allowed in JSX props. Use {'${text}'} instead.`,
                });
            },
            JSXText(node) {
                const text = node.value.trim();
                if (text === '') {
                    return;
                }

                context.report({
                    node,
                    message: `String literals should be wrapped in JSX expression: {'${text}'}`,
                });
            },
        };
    };
}
