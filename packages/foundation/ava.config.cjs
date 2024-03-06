/*eslint-env commonjs*/

'use strict';

module.exports = function resolveAvaConfig() {
    return {
        files: ['**/__tests__/**/*.test.{js,cjs,mjs,ts,tsx,cts,mts}'],
        typescript: {
            rewritePaths: {
                'src/': '__dist/',
            },
            compile: false,
        },
    };
};
