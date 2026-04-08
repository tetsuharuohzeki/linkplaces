/**
 * @license
 * MIT License
 *
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 * Copyright (c) 2023-PRESENT ESLint Stylistic contributors
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// - https://github.com/eslint-stylistic/eslint-stylistic/blob/01d55aa9a54ce288b0aedce23934926bb3c1dd2d/packages/eslint-plugin/rules/jsx-self-closing-comp/jsx-self-closing-comp.ts
// - https://github.com/eslint-stylistic/eslint-stylistic/blob/01d55aa9a54ce288b0aedce23934926bb3c1dd2d/shared/utils/ast/jsx.ts

// See https://github.com/babel/babel/blob/ce420ba51c68591e057696ef43e028f41c6e04cd/packages/babel-types/src/validators/react/isCompatTag.js
// for why we only test for the first character
const COMPAT_TAG_REGEX = /^[a-z]/u;

function isDOMComponent(node) {
    const name = getElementType(node);
    return COMPAT_TAG_REGEX.test(name);
}

function resolveMemberExpressions(object, property) {
    if (object.type === 'JSXMemberExpression') {
        return `${resolveMemberExpressions(object.object, object.property)}.${property.name}`;
    }

    return `${object.name}.${property.name}`;
}

function getElementType(node) {
    if (node.type === 'JSXOpeningFragment') {
        return '<>';
    }

    const { name } = node;
    if (!name) {
        throw new Error('The argument provided is not a JSXElement node.');
    }

    if (name.type === 'JSXMemberExpression') {
        const { object, property } = name;
        return resolveMemberExpressions(object, property);
    }

    if (name.type === 'JSXNamespacedName') {
        return `${name.namespace.name}:${name.name.name}`;
    }

    return node.name.name;
}

/**
 *  @import { RuleFunction } from '@eslint-react/kit';
 */

/**
 *  @returns {RuleFunction}
 */
export function jsxSelfClosing() {
    const component = true;
    const html = false;

    return function jsxSelfClosingImpl(context) {
        function isComponent(node) {
            return (
                node.name &&
                (node.name.type === 'JSXIdentifier' || node.name.type === 'JSXMemberExpression') &&
                !isDOMComponent(node)
            );
        }

        function childrenIsEmpty(node) {
            return node.parent.children.length === 0;
        }

        function childrenIsMultilineSpaces(node) {
            const childrens = node.parent.children;

            return (
                childrens.length === 1 &&
                childrens[0].type === 'JSXText' &&
                childrens[0].value.includes('\n') &&
                childrens[0].value.replace(/(?!\xA0)\s/gu, '') === ''
            );
        }

        function isShouldBeSelfClosed(node) {
            const isTarget = (component && isComponent(node)) || (html && isComponent(node));
            if (!isTarget) {
                return false;
            }

            const isSelfClosing = node.selfClosing;
            if (isSelfClosing) {
                return false;
            }

            const isMultiline = childrenIsEmpty(node) || childrenIsMultilineSpaces(node);
            if (!isMultiline) {
                return false;
            }

            return true;
        }

        return {
            JSXOpeningElement(node) {
                if (!isShouldBeSelfClosed(node)) {
                    return;
                }

                context.report({
                    message: 'Empty components are self-closing',
                    node,
                    fix(fixer) {
                        // Represents the last character of the JSXOpeningElement, the '>' character
                        const openingElementEnding = node.range[1] - 1;
                        // Represents the last character of the JSXClosingElement, the '>' character
                        const closingElementEnding = node.parent.closingElement?.range[1] ?? NaN;

                        // Replace />.*<\/.*>/ with '/>'
                        const range = [openingElementEnding, closingElementEnding];
                        return fixer.replaceTextRange(range, '/>');
                    },
                });
            },
        };
    };
}
