/* eslint-env commonjs */
'use strict';

const babel = require('rollup-plugin-babel');

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
        'prop-types',
    ],
    globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes',
    },

    plugins: [
        // https://github.com/rollup/rollup-plugin-babel
        babel({
            exclude: 'node_modules/**',
            externalHelpers: false,
            babelrc: false,
            presets: [
                'react'
            ],
            plugins: [],
        }),
    ],
};
