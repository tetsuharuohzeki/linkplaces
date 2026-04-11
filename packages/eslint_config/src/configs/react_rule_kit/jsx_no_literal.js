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

const SINGE_QUOTE_CHAR = `'`;
const DOUBLE_QUOTE_CHAR = `"`;

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

                const valueNode = node.value;
                if (!(!!valueNode && valueNode.type === 'Literal')) {
                    return;
                }

                context.report({
                    node,
                    message: `String literals are not wrapped as \`{value}\` JSX props.`,
                    fix(fixer) {
                        const rawValue = valueNode.raw;
                        const replaced = `{${rawValue}}`;
                        return fixer.replaceText(valueNode, replaced);
                    },
                });
            },
            JSXText(node) {
                const text = node.value.trim();
                if (text === '') {
                    return;
                }

                context.report({
                    node,
                    message: `String literals should be wrapped as \`{value}\` in JSX expression`,
                    fix(fixer) {
                        const rawValue = node.raw;
                        const trimmed = rawValue.trim();

                        let replaced;
                        if (trimmed.startsWith(SINGE_QUOTE_CHAR) && trimmed.endsWith(SINGE_QUOTE_CHAR)) {
                            replaced = `{\`${rawValue}\`}`;
                        } else if (trimmed.startsWith(DOUBLE_QUOTE_CHAR) && trimmed.endsWith(DOUBLE_QUOTE_CHAR)) {
                            replaced = `{\`${rawValue}\`}`;
                        } else {
                            replaced = `{'${rawValue}'}`;
                        }

                        return fixer.replaceText(node, replaced);
                    },
                });
            },
        };
    };
}
