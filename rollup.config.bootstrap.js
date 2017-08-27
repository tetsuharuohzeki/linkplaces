/* eslint-env commonjs */
'use strict';

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    context: 'this',
    strict: true,
    sourcemap: true,
    treeshake: true,

    output: {
        format: 'cjs',
    },

    external: [
    ],
    globals: {
    },

    plugins: [
    ],
};
