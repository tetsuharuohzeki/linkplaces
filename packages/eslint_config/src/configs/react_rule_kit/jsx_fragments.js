import { MaybeOperator } from 'option-t/maybe';

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

const DEFAULT_MODE_SYNTAX = 'syntax';

/**
 *  @typedef    {Object}    JsxsFragmentsOptions
 *  @property   {typeof DEFAULT_MODE_SYNTAX|'element'?} mode
 */

/**
 * @param   {JsxsFragmentsOptions=}   options
 * @returns {RuleFunction}
 */
export function jsxFragments(options = undefined) {
    const mode = MaybeOperator.mapOr(options, DEFAULT_MODE_SYNTAX, (options) => {
        return MaybeOperator.unwrapOr(options.mode, DEFAULT_MODE_SYNTAX);
    });

    return (context) => {
        function reportSyntaxPreferred(node, pattern) {
            const hasAttributes = node.attributes.length > 0;
            if (hasAttributes) {
                return;
            }

            context.report({
                node,
                message: `Use shorthand fragment syntax '<>...</>' instead of '<${pattern}>...</${pattern}'.`,
                fix(fixer) {
                    const closing = node.parent?.closingElement;
                    if (!closing) {
                        return null;
                    }
                    return [fixer.replaceText(node, '<>'), fixer.replaceText(closing, '</>')];
                },
            });
        }

        return {
            JSXOpeningElement(node) {
                const name = node.name;

                if (name.type === 'JSXIdentifier' && name.name === 'Fragment') {
                    if (mode === 'syntax') {
                        reportSyntaxPreferred(node, 'Fragment');
                    }
                    return;
                }

                // Handle <React.Fragment> (JSXMemberExpression)
                if (name.type !== 'JSXMemberExpression') {
                    return;
                }
                if (name.object.type !== 'JSXIdentifier' || name.object.name !== 'React') {
                    return;
                }
                if (name.property.type !== 'JSXIdentifier' || name.property.name !== 'Fragment') {
                    return;
                }

                if (mode === 'syntax') {
                    reportSyntaxPreferred(node, 'React.Fragment');
                }
            },
            JSXFragment(node) {
                if (mode === 'element') {
                    context.report({
                        node,
                        message: "Use '<React.Fragment>...</React.Fragment>' instead of shorthand '<>...</>'.",
                        fix(fixer) {
                            return [
                                fixer.replaceText(node.openingFragment, '<React.Fragment>'),
                                fixer.replaceText(node.closingFragment, '</React.Fragment>'),
                            ];
                        },
                    });
                }
            },
        };
    };
}
