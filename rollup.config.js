/* eslint-env commonjs */
'use strict';

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    format: 'iife',
    exports: 'none',
    useStrict: true,
    sourceMap: true,
    treeshake: true,

    external: [
        'react',
        'react-dom',
    ],
    globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },

    plugins: [
    ],
};
