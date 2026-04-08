// https://github.com/jsx-eslint/eslint-plugin-react/blob/012ec39f962627d5312e9fbaee3eb41d9a4d8bb6/lib/rules/jsx-no-literals.js
// https://www.eslint-react.xyz/docs/migrating-from-eslint-plugin-react#jsx-no-literals

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

/**
 * @returns {RuleFunction}
 */
export function jsxNoLiterals(options = {}) {
    const { noStrings = false, allowedStrings = [], ignoreProps = true } = options;
    const allowedSet = new Set(allowedStrings);
    return function jsxNoLiteralsImpl(context) {
        return {
            Literal(node) {
                if (typeof node.value !== 'string') {
                    return;
                }
                const text = node.value.trim();
                if (text === '' || allowedSet.has(text)) {
                    return;
                }

                const parent = node.parent;
                if (!parent) {
                    return;
                }

                if (parent.type === 'JSXAttribute') {
                    if (!ignoreProps) {
                        context.report({
                            node,
                            message: `String literals are not allowed in JSX props. Use {'${text}'} instead.`,
                        });
                    }
                    return;
                }

                if (parent.type === 'JSXExpressionContainer') {
                    return;
                }

                if (parent.type === 'JSXElement' || parent.type === 'JSXFragment') {
                    if (noStrings) {
                        context.report({
                            node,
                            message: `String literals are not allowed as JSX children.`,
                        });
                    } else {
                        context.report({
                            node,
                            message: `String literals should be wrapped in JSX expression: {'${text}'}`,
                        });
                    }
                }
            },
            JSXText(node) {
                const text = node.value.trim();
                if (text === '' || allowedSet.has(text)) {
                    return;
                }

                if (noStrings) {
                    context.report({
                        node,
                        message: `String literals are not allowed as JSX children.`,
                    });
                } else {
                    context.report({
                        node,
                        message: `String literals should be wrapped in JSX expression: {'${text}'}`,
                    });
                }
            },
        };
    };
}
