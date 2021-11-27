// import from https://github.com/karen-irc/karen/blob/27721039af844337264ad83adadc2c4bd3a1c568/tools/stylelint/stylelintrc_core.js
/**
 * MIT License
 *
 * Copyright (c) 2016 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 * Copyright (c) 2016 Yusuke Suzuki <utatane.tea@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*eslint quote-props: [2, "always"] */

'use strict';

module.exports = {
    'plugins': [],

    'extends': [
        'stylelint-config-standard'
    ],

    // https://stylelint.io/user-guide/rules/
    'rules': {
        // Disable the rule enabled in stylelint-config-standard
        // I don't think this is useful...
        'alpha-value-notation': null,

        // Allow to group the code chunk.
        'at-rule-empty-line-before': null,

        // Disable the rule enabled in stylelint-config-standard
        // I don't think this is useful...
        'color-function-notation': null,

        // Disable the rule enabled in stylelint-config-standard
        // We use BEM style.
        'custom-property-pattern': null,

        // For readability, I don't enforce this rule always.
        'declaration-block-no-redundant-longhand-properties': null,

        // quote
        'font-family-name-quotes': 'always-unless-keyword',
        'function-url-quotes': ['always', {
            // except: ['empty'],
        }],

        // vendor prefix
        'at-rule-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,

        // avoid unexpeced override.
        'declaration-no-important': true,
        // prevent mixed content.
        'function-url-scheme-allowed-list': ['data', /^https:\/\//u],

        'font-weight-notation': 'named-where-possible',

        'selector-type-no-unknown': [true, {
            'ignore': ['custom-elements']
        }],

        // Disable the rule enabled in stylelint-config-standard
        // We use BEM style.
        'selector-class-pattern': null,
    },

    'reportNeedlessDisables': [true, {
        'severity': 'warning',
    }],
    'reportInvalidScopeDisables': [true, {
        'severity': 'warning',
    }],
    'reportDescriptionlessDisables': [false, {
        'severity': 'warning',
    }]
};
