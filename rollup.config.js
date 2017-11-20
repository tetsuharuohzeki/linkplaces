/* eslint-env commonjs, node */
'use strict';

const MaybeMod = require('option-t/lib/Maybe');

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const IS_WEBEXT_BUILD = (process.env.IS_WEBEXT_BUILD === undefined) ?
    false : !!process.env.IS_WEBEXT_BUILD;

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.unwrapOr(process.env.BUILD_DATE, 'unknown', String);

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    strict: true,
    treeshake: true,
    sourcemap: true,

    output: {
        format: 'iife',
        exports: 'none',
    },

    external: [
        'react',
        'react-dom',
        'prop-types',
        'redux',
        'redux-thunk',
        'rxjs',
    ],
    globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes',
        'redux': 'Redux',
        'redux-thunk': 'window.ReduxThunk.default',
        'rxjs': 'Rx',
    },

    plugins: [
        // https://github.com/rollup/rollup-plugin-node-resolve
        nodeResolve({
            module: true,
            main: true,
            jsnext: true,
            browser: true, // for browser
            preferBuiltins: false, // linking for browser

            // rollup does not have 'extensions' option,
            // so we need to specify this option at here to import jsx file.
            extensions: ['.mjs', '.js', '.jsx'],
        }),

        replace({
            //include: 'config.js',
            exclude: 'node_modules/**',
            delimiters: ['', ''],
            values: {
                'process.env.IS_WEBEXT_BUILD': IS_WEBEXT_BUILD,
                'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
                'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
            },
        }),

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
