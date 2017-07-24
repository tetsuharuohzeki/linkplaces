/* eslint-env commonjs */
'use strict';

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    format: 'cjs',
    exports: 'named',
    useStrict: true,
    sourceMap: true,
    treeshake: true,

    external: [
    ],
    globals: {
    },

    plugins: [
    ],
};
