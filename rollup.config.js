/* eslint-env commonjs, node */
'use strict';

const MaybeMod = require('option-t/cjs/Maybe');

const alias = require('rollup-plugin-alias');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const pathMappingRx = require('rxjs/_esm2015/path-mapping');

const {
    replaceImportWithGlobal,
    createDefaultExport,
} = require('./tools/rollup/replace_import_with_global');

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.mapOr(process.env.BUILD_DATE, 'unknown', String);
const LIB_NODE_ENV = MaybeMod.mapOr(process.env.RELEASE_CHANNEL, 'production', String);

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
LIB_NODE_ENV: ${LIB_NODE_ENV}
======================================
`);

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    treeshake: true,

    output: {
        strict: true,
        format: 'es',
        exports: 'none',

        sourcemap: true,
        globals: {
        },
    },

    external: [
    ],

    perf: false,

    experimentalDynamicImport: true,

    plugins: [
        replaceImportWithGlobal({
            'react': createDefaultExport('window.React'),
            'react-dom': createDefaultExport('window.ReactDOM'),
            'prop-types': createDefaultExport('window.PropTypes'),
            'redux-thunk': createDefaultExport('window.ReduxThunk.default'),
        }),

        // https://github.com/rollup/rollup-plugin-alias/issues
        alias(pathMappingRx()),

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

        // https://github.com/rollup/rollup-plugin-replace
        replace({
            exclude: [
                'node_modules/**',
            ],
            delimiters: ['', ''],
            values: {
                'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
                'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
            },
        }),
        replace({
            include: [
                '**/redux/es/redux.js',
            ],
            delimiters: ['', ''],
            values: {
                'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
            },
        }),

        // https://github.com/rollup/rollup-plugin-babel
        babel({
            exclude: 'node_modules/**',
            externalHelpers: false,
            babelrc: false,
            presets: [
                '@babel/preset-react',
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-async-generators',
            ],
        }),
    ],
};
