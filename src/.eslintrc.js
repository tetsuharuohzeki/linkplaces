/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* eslint-env commonjs */
/*eslint quote-props: [2, "always"] */

"use strict"; // eslint-disable-line strict

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
  "rules": {
    "indent": [2, 2, {
      "SwitchCase": 1
    }],

    "quotes": [2, "double", {
      "avoidEscape": true,
      "allowTemplateLiterals": true,
    }],
  }
};
