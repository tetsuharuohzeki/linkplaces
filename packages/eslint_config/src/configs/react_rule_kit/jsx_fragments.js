import { MaybeOperator } from 'option-t/maybe';

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

const MODE_SYNTAX = 'syntax';
const MODE_ELEMENT = 'element';
const DEFAULT_MODE = MODE_SYNTAX;

/**
 *  @typedef    {Object}    JsxsFragmentsOptions
 *  @property   {(typeof MODE_SYNTAX|typeof MODE_ELEMENT)?} mode
 */

/**
 * @param   {JsxsFragmentsOptions=}   options
 * @returns {RuleFunction}
 */
export function jsxFragments(options = undefined) {
    const mode = MaybeOperator.mapOr(options, DEFAULT_MODE, (options) => {
        return MaybeOperator.unwrapOr(options.mode, DEFAULT_MODE);
    });

    return function jsxFragmentsImpl(context) {
        function reportSyntaxPreferred(node, _) {
            const hasAttributes = node.attributes.length > 0;
            if (hasAttributes) {
                return;
            }

            context.report({
                node,
                message: `Use shorthand fragment syntax '<>...</>'.`,
                fix(fixer) {
                    const closing = node.parent?.closingElement;
                    if (!closing) {
                        return null;
                    }
                    return [fixer.replaceText(node, '<>'), fixer.replaceText(closing, '</>')];
                },
            });
        }

        switch (mode) {
            case MODE_SYNTAX:
                return {
                    JSXOpeningElement(node) {
                        const name = node.name;
                        if (name.type === 'JSXIdentifier' && name.name === 'Fragment') {
                            reportSyntaxPreferred(node, 'Fragment');
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

                        reportSyntaxPreferred(node, 'React.Fragment');
                    },
                };
            case MODE_ELEMENT:
                return {
                    JSXFragment(node) {
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
                    },
                };
            default:
                throw new RangeError(`unknown mode: ${mode}`);
        }
    };
}
