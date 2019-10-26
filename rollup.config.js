/* eslint-env commonjs, node */
'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    USE_REACT_CONCURRENT_MODE,
} = require('./tools/buildconfig');

const {
    replaceImportWithGlobal,
    createDefaultExport,
    createNamedExport,
    createModule,
} = require('./tools/rollup/replace_import_with_global');

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
USE_REACT_CONCURRENT_MODE: ${USE_REACT_CONCURRENT_MODE}
======================================
`);

const RXJS_NAMESPCACE_OBJ_NAME = 'window.rxjs';
const RXJS_OPERATOR_NAMESPCACE_OBJ_NAME = `${RXJS_NAMESPCACE_OBJ_NAME}.operators`;

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = async function (_commandLineArgs) {

    return {
        strictDeprecations: true,

        treeshake: true,

        output: {
            strict: true,
            format: 'esm',
            exports: 'none',
            freeze: true,
            preferConst: true,

            sourcemap: true,
            globals: {
            },
        },

        external: [
        ],

        perf: false,

        inlineDynamicImports: true,
        shimMissingExports: false,

        plugins: [
            replaceImportWithGlobal({
                'react': createModule([
                    createDefaultExport('window.React'),
                ]),
                'react-dom': createModule([
                    createDefaultExport('window.ReactDOM'),
                ]),
                // 'redux-thunk': createDefaultExport('window.ReduxThunk.default'),

                // I know these are pretty messy approach.
                // But rxjs does not support properly TypeScript+rollup
                'rxjs': createModule([
                    createNamedExport('BehaviorSubject', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Observable', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('merge', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Subject', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Subscription', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('animationFrameScheduler', RXJS_NAMESPCACE_OBJ_NAME),
                ]),
                'rxjs/operators': createModule([
                    createNamedExport('filter', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('map', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('share', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('startWith', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('debounceTime', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                ]),
            }),

            // https://github.com/rollup/rollup-plugin-node-resolve
            nodeResolve({
                mainFields: ['module', 'main'],

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
                    'process.env.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
                    'process.env.USE_REACT_CONCURRENT_MODE': JSON.stringify(USE_REACT_CONCURRENT_MODE),
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
                    ['@babel/preset-react', {
                        // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
                        development: !IS_PRODUCTION_MODE,
                    }],
                ],
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                ],
            }),
        ],
    };
};
